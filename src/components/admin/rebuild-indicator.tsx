"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CloudUpload, Loader2, TriangleAlert } from "lucide-react";
import { initSiteRebuild, publishNow, useSiteRebuild } from "@/lib/site-rebuild";
import { cn } from "@/lib/utils";

/** Floating status pill for auto-publishing admin changes to the live site. */
export function RebuildIndicator() {
  const state = useSiteRebuild();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    initSiteRebuild();
  }, []);

  useEffect(() => {
    if (state.status !== "scheduled" && state.status !== "started") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  if (state.status === "idle" || state.status === "unavailable") return null;
  // Hide the success message after 5 minutes (the build is done by then)
  if (state.status === "started" && now - state.at > 5 * 60_000) return null;

  const base =
    "fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl";

  if (state.status === "scheduled") {
    const seconds = Math.max(0, Math.ceil((state.at - now) / 1000));
    return (
      <div className={cn(base, "border-primary/30 bg-card/95")} role="status">
        <CloudUpload className="h-5 w-5 shrink-0 text-primary" />
        <span>Publishing changes to the website in {seconds}s…</span>
        <button
          onClick={() => void publishNow()}
          className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
        >
          Publish now
        </button>
      </div>
    );
  }

  if (state.status === "sending") {
    return (
      <div className={cn(base, "border-primary/30 bg-card/95")} role="status">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
        <span>Starting website rebuild…</span>
      </div>
    );
  }

  if (state.status === "started") {
    return (
      <div className={cn(base, "border-emerald-300 bg-emerald-50/95 text-emerald-900")} role="status">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <span>Rebuild started. Changes will be live in about 2–4 minutes.</span>
      </div>
    );
  }

  return (
    <div className={cn(base, "border-red-300 bg-red-50/95 text-red-900")} role="alert">
      <TriangleAlert className="h-5 w-5 shrink-0 text-red-600" />
      <span>Website rebuild failed: {state.message}</span>
      <button
        onClick={() => void publishNow()}
        className="shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}
