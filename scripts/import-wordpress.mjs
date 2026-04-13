import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import admin from "firebase-admin";

const BASE_URL = "https://uptomarrakech.com";
const OUTPUT_DIR = path.join(process.cwd(), "scripts", "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "wordpress-import.json");

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

async function loadEnvFiles() {
  const envPaths = [
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".env.local"),
  ];

  for (const envPath of envPaths) {
    try {
      const content = await fs.readFile(envPath, "utf8");
      const parsed = parseEnvFile(content);
      for (const [key, value] of Object.entries(parsed)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch {
      // Ignore missing or unreadable env files.
    }
  }
}

const CATEGORY_MAP = {
  "location-villas": {
    type: "accommodation",
    slug: "accommodation",
    name: "Accommodation",
  },
  "rent-villa": {
    type: "accommodation",
    slug: "accommodation",
    name: "Accommodation",
  },
  "boites-de-nuit": {
    type: "night_club",
    slug: "night-clubs",
    name: "Night clubs",
  },
  "night-club": {
    type: "night_club",
    slug: "night-clubs",
    name: "Night clubs",
  },
  activites: { type: "activity", slug: "activities", name: "Activities" },
  activities: { type: "activity", slug: "activities", name: "Activities" },
  "beach-club-marrakech": {
    type: "beach_club",
    slug: "beach-clubs",
    name: "Beach clubs",
  },
  "beach-club": {
    type: "beach_club",
    slug: "beach-clubs",
    name: "Beach clubs",
  },
  spas: { type: "spa", slug: "spa", name: "Spa" },
  "location-de-voiture": {
    type: "car_rental",
    slug: "transport/car-rental",
    name: "Car rental",
  },
  "car-rental": {
    type: "car_rental",
    slug: "transport/car-rental",
    name: "Car rental",
  },
  "transport-touristique": {
    type: "tourist_transport",
    slug: "transport/tourist-transport",
    name: "Tourist transport",
  },
};

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchAllProducts() {
  const items = [];
  let page = 1;
  while (true) {
    const url = `${BASE_URL}/wp-json/wp/v2/product?per_page=100&page=${page}&_embed=1`;
    const batch = await fetchJson(url);
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return items;
}

async function scrape() {
  const [wpCategories, wpProducts] = await Promise.all([
    fetchJson(`${BASE_URL}/wp-json/wp/v2/product_cat?per_page=100`),
    fetchAllProducts(),
  ]);
  const wpCategoryMap = new Map(wpCategories.map((c) => [c.id, c]));
  const categoriesByType = new Map();
  const items = [];

  for (const product of wpProducts) {
    try {
      const categoryId = product.product_cat?.[0];
      const wpCategory = wpCategoryMap.get(categoryId);
      const category = wpCategory ? CATEGORY_MAP[wpCategory.slug] : null;
      if (!category || !product.title?.rendered) continue;

      if (!categoriesByType.has(category.type)) {
        categoriesByType.set(category.type, {
          slug: category.slug,
          name: category.name,
          type: category.type,
          sortOrder: categoriesByType.size,
          published: true,
        });
      }

      const title = stripHtml(product.title.rendered);
      const excerpt = stripHtml(product.excerpt?.rendered || "");
      const description = stripHtml(product.content?.rendered || excerpt);
      const coverImage =
        product._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      if (!coverImage) continue;

      const gallery = new Set([coverImage]);
      const html = product.content?.rendered || "";
      const srcMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
        (m) => m[1],
      );
      for (const src of srcMatches) {
        if (src && src.startsWith("http")) gallery.add(src);
      }

      const joined = `${title} ${excerpt} ${description}`;
      const locationMatch = joined.match(
        /(route [^,.]+|targa|centre ville|route de f[eè]s|bab atlas)/i,
      );
      const roomsMatch = joined.match(/(\d+)\s*chambres?/i);
      const peopleMatch = joined.match(/(\d+)\s*personnes?/i);
      const priceText = stripHtml(
        product.yoast_head_json?.og_description || joined,
      );
      const priceMatch = priceText.match(/(\d{2,5}(?:[.,]\d+)?)/);

      items.push({
        categoryType: category.type,
        slug: product.slug || slugify(title),
        title,
        excerpt: excerpt || description.slice(0, 190),
        description,
        coverImage,
        gallery: Array.from(gallery),
        location: locationMatch ? locationMatch[1] : undefined,
        price: priceMatch ? Number(priceMatch[1].replace(",", ".")) : 0,
        priceUnit: category.type === "accommodation" ? "night" : "day",
        accommodation:
          category.type === "accommodation"
            ? {
                rooms: roomsMatch ? Number(roomsMatch[1]) : 0,
                people: peopleMatch ? Number(peopleMatch[1]) : 0,
              }
            : undefined,
        published: true,
      });
    } catch (error) {
      console.warn(`Skipping product ${product?.id}: ${error.message}`);
    }
  }

  return {
    source: BASE_URL,
    importedAt: new Date().toISOString(),
    categories: Array.from(categoriesByType.values()),
    items,
  };
}

async function writeOutput(data) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf8");
  console.log(`Saved import JSON: ${OUTPUT_FILE}`);
}

async function importToFirestore(data) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_PATH env var.");
  }
  const json = await fs.readFile(serviceAccountPath, "utf8");
  const serviceAccount = JSON.parse(json);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const db = admin.firestore();

  const batchSize = 300;
  let batch = db.batch();
  let count = 0;

  const commitIfNeeded = async () => {
    if (count > 0) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  };

  const clean = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    );

  for (const category of data.categories) {
    const ref = db.collection("categories").doc();
    batch.set(ref, clean(category));
    count++;
    if (count >= batchSize) await commitIfNeeded();
  }

  for (const item of data.items) {
    const ref = db.collection("items").doc();
    batch.set(ref, clean(item));
    count++;
    if (count >= batchSize) await commitIfNeeded();
  }
  await commitIfNeeded();
  console.log(
    `Imported to Firestore: ${data.categories.length} categories, ${data.items.length} items.`,
  );
}

async function run() {
  await loadEnvFiles();

  const toFirestore = process.argv.includes("--to-firestore");
  console.log("Scraping WordPress data...");
  const data = await scrape();
  await writeOutput(data);
  console.log(
    `Found ${data.categories.length} categories and ${data.items.length} items.`,
  );

  if (toFirestore) {
    await importToFirestore(data);
  } else {
    console.log("Dry run complete. Use --to-firestore to import directly.");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
