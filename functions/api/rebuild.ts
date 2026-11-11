/**
 * Cloudflare Pages Function -> POST /api/rebuild
 *
 * Called by the admin dashboard after products/blogs change. It verifies the caller's
 * Firebase ID token, checks they are an admin (same rules as AdminGuard), then calls
 * the Cloudflare Pages deploy hook so the static site is rebuilt with the new data.
 *
 * Environment variables (Pages > Settings > Variables and Secrets):
 *   CF_DEPLOY_HOOK_URL               (Secret) deploy hook URL from Pages > Settings > Builds
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID  already set for the build
 *   MASTER_ADMIN_EMAIL               optional, same "master" email allowed by AdminGuard
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

type Env = {
  CF_DEPLOY_HOOK_URL?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  FIREBASE_PROJECT_ID?: string;
  MASTER_ADMIN_EMAIL?: string;
};

type Context = { request: Request; env: Env };

type FirebaseClaims = JWTPayload & { email?: string; admin?: boolean };

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

function json(status: number, body: { success: boolean; message: string }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** Same fallback as AdminGuard: is this email listed in the Firestore `admins` collection? */
async function isListedAdmin(projectId: string, idToken: string, email: string): Promise<boolean> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "admins" }],
          where: { fieldFilter: { field: { fieldPath: "email" }, op: "EQUAL", value: { stringValue: email } } },
          limit: 1,
        },
      }),
    },
  );
  if (!res.ok) return false;
  const rows = (await res.json()) as Array<{ document?: unknown }>;
  return rows.some((row) => row.document);
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!env.CF_DEPLOY_HOOK_URL || !projectId) {
    return json(500, { success: false, message: "Rebuild is not configured (CF_DEPLOY_HOOK_URL / project id missing)" });
  }

  const idToken = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!idToken) return json(401, { success: false, message: "Missing token" });

  let claims: FirebaseClaims;
  try {
    const verified = await jwtVerify(idToken, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });
    claims = verified.payload as FirebaseClaims;
  } catch {
    return json(401, { success: false, message: "Invalid or expired token" });
  }

  const email = claims.email?.toLowerCase() ?? "";
  const master = env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
  const authorized =
    claims.admin === true ||
    (master !== undefined && master !== "" && email === master) ||
    (email !== "" && (await isListedAdmin(projectId, idToken, email)));

  if (!authorized) return json(403, { success: false, message: "Not an admin" });

  const hook = await fetch(env.CF_DEPLOY_HOOK_URL, { method: "POST" });
  if (!hook.ok) {
    console.error("Deploy hook failed", hook.status, await hook.text().catch(() => ""));
    return json(502, { success: false, message: `Deploy hook failed (${hook.status})` });
  }

  return json(200, { success: true, message: "Rebuild started" });
}

export async function onRequest(): Promise<Response> {
  return json(405, { success: false, message: "Method not allowed" });
}
