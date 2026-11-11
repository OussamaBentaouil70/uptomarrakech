"use client";

/**
 * Auto-publish for the static site (Cloudflare Pages).
 *
 * After an admin saves/deletes a product or blog post, call scheduleSiteRebuild().
 * Changes are batched for DEBOUNCE_MS, then POST /api/rebuild (functions/api/rebuild.ts)
 * triggers a new Cloudflare build. The new pages are live ~2-4 minutes later.
 */
import { useSyncExternalStore } from "react";
import { getClientAuth } from "@/lib/firebase/auth";

const DEBOUNCE_MS = 20_000;
const PENDING_KEY = "site-rebuild-pending";

export type RebuildState =
  | { status: "idle" }
  | { status: "scheduled"; at: number }
  | { status: "sending" }
  | { status: "started"; at: number }
  | { status: "unavailable" }
  | { status: "error"; message: string };

let state: RebuildState = { status: "idle" };
let timer: ReturnType<typeof setTimeout> | null = null;
let cachedToken: string | null = null;
const listeners = new Set<() => void>();

function setState(next: RebuildState) {
  state = next;
  listeners.forEach((l) => l());
}

function setPending(pending: boolean) {
  try {
    if (pending) localStorage.setItem(PENDING_KEY, "1");
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable: the in-memory timer still works */
  }
}

function hasPending(): boolean {
  try {
    return localStorage.getItem(PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

async function refreshToken(): Promise<string | null> {
  const user = getClientAuth().currentUser;
  if (!user) return null;
  cachedToken = await user.getIdToken();
  return cachedToken;
}

/** Queue a rebuild. Multiple calls within DEBOUNCE_MS result in a single build. */
export function scheduleSiteRebuild() {
  if (typeof window === "undefined") return;
  setPending(true);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void publishNow(), DEBOUNCE_MS);
  setState({ status: "scheduled", at: Date.now() + DEBOUNCE_MS });
  void refreshToken().catch(() => undefined); // keep a fresh token for the pagehide flush
}

/** Trigger the rebuild immediately (also used by the "Publish now" button). */
export async function publishNow() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  setState({ status: "sending" });
  try {
    const token = await refreshToken();
    if (!token) throw new Error("Not signed in");

    const res = await fetch("/api/rebuild", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      // `next dev` has no Cloudflare Functions: nothing to rebuild locally.
      setPending(false);
      setState({ status: "unavailable" });
      return;
    }

    const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || !body.success) throw new Error(body.message || `HTTP ${res.status}`);

    setPending(false);
    setState({ status: "started", at: Date.now() });
  } catch (error) {
    setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
  }
}

let initialized = false;

/** Call once from the admin layout: flushes on tab close and resumes a rebuild lost by a closed tab. */
export function initSiteRebuild() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("pagehide", () => {
    if (!timer || !cachedToken) return;
    clearTimeout(timer);
    timer = null;
    // keepalive lets the request finish even though the page is closing
    void fetch("/api/rebuild", {
      method: "POST",
      headers: { Authorization: `Bearer ${cachedToken}` },
      keepalive: true,
    })
      .then((res) => res.ok && setPending(false))
      .catch(() => undefined);
  });

  if (hasPending()) scheduleSiteRebuild();
}

export function useSiteRebuild(): RebuildState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}
