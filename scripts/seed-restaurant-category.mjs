import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import admin from "firebase-admin";

function parseEnvFile(content) {
  const out = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }
  return out;
}

async function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const content = await fs.readFile(envPath, "utf8");
    const parsed = parseEnvFile(content);
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Keep defaults when .env.local is missing.
  }
}

function getFirebaseConfigFromEnv() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  return { apiKey, projectId, adminEmail, adminPassword };
}

async function getDbFromServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountJson && !serviceAccountPath) return null;

  let serviceAccount;
  try {
    if (serviceAccountJson) {
      serviceAccount = JSON.parse(serviceAccountJson);
    } else {
      const resolvedPath = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.resolve(process.cwd(), serviceAccountPath);
      const json = await fs.readFile(resolvedPath, "utf8");
      serviceAccount = JSON.parse(json);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Service account unavailable (${message}). Falling back to REST auth.`);
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.firestore();
}

function toFirestoreFieldValue(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  return { nullValue: null };
}

function fromFirestoreFieldValue(value) {
  if (!value || typeof value !== "object") return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  return undefined;
}

async function signInWithPassword(apiKey, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Auth failed: ${data?.error?.message || res.statusText}`);
  }

  return data.idToken;
}

async function runFirestoreQuery(projectId, idToken, structuredQuery) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ structuredQuery }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Firestore query failed: ${data?.error?.message || res.statusText}`);
  }

  return Array.isArray(data) ? data : [];
}

async function createCategoryViaRest(projectId, idToken, category) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/categories`;
  const fields = Object.fromEntries(
    Object.entries(category).map(([k, v]) => [k, toFirestoreFieldValue(v)]),
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Create category failed: ${data?.error?.message || res.statusText}`);
  }

  return data?.name?.split("/").pop();
}

async function runWithRestApi() {
  const { apiKey, projectId, adminEmail, adminPassword } = getFirebaseConfigFromEnv();
  if (!apiKey || !projectId || !adminEmail || !adminPassword) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_ADMIN_EMAIL or NEXT_PUBLIC_ADMIN_PASSWORD in .env.local",
    );
  }

  const idToken = await signInWithPassword(apiKey, adminEmail, adminPassword);

  const existingRows = await runFirestoreQuery(projectId, idToken, {
    from: [{ collectionId: "categories" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "type" },
        op: "EQUAL",
        value: { stringValue: "restaurant" },
      },
    },
    limit: 1,
  });

  const exists = existingRows.some((row) => Boolean(row.document));
  if (exists) {
    console.log("Restaurant category already exists. No changes made.");
    return;
  }

  const orderRows = await runFirestoreQuery(projectId, idToken, {
    from: [{ collectionId: "categories" }],
    orderBy: [{ field: { fieldPath: "sortOrder" }, direction: "DESCENDING" }],
    limit: 1,
  });

  let maxSortOrder = -1;
  for (const row of orderRows) {
    const fields = row.document?.fields;
    const sortOrder = fromFirestoreFieldValue(fields?.sortOrder);
    if (typeof sortOrder === "number" && Number.isFinite(sortOrder)) {
      maxSortOrder = Math.max(maxSortOrder, sortOrder);
    }
  }

  const category = {
    slug: "restaurants",
    name: "Restaurants",
    type: "restaurant",
    heroImage: "",
    sortOrder: maxSortOrder + 1,
    published: true,
  };

  const id = await createCategoryViaRest(projectId, idToken, category);
  console.log(`Restaurant category created with id: ${id}`);
}

async function run() {
  await loadDotEnvLocal();

  const db = await getDbFromServiceAccount();
  if (!db) {
    await runWithRestApi();
    return;
  }

  const categoriesRef = db.collection("categories");

  const existingRestaurant = await categoriesRef
    .where("type", "==", "restaurant")
    .limit(1)
    .get();

  if (!existingRestaurant.empty) {
    console.log("Restaurant category already exists. No changes made.");
    return;
  }

  const allCategoriesSnap = await categoriesRef.get();
  let maxSortOrder = -1;

  allCategoriesSnap.forEach((docSnap) => {
    const sortOrder = Number(docSnap.data().sortOrder);
    if (Number.isFinite(sortOrder)) {
      maxSortOrder = Math.max(maxSortOrder, sortOrder);
    }
  });

  const category = {
    slug: "restaurants",
    name: "Restaurants",
    type: "restaurant",
    heroImage: "",
    sortOrder: maxSortOrder + 1,
    published: true,
  };

  const created = await categoriesRef.add(category);
  console.log(`Restaurant category created with id: ${created.id}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
