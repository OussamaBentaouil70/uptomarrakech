"use client";

import { useEffect, useMemo, useState } from "react";
import { listItems } from "@/lib/firebase/data";
import type { CategoryType, Item } from "@/lib/types";
import { CategoryCard } from "@/components/cards/category-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { AccommodationFilters } from "@/components/accommodation-filters";

type Props = {
  title: string;
  type: CategoryType;
  isAccommodation?: boolean;
  selectedLocation?: string;
  selectedRooms?: string;
};

const categoryThemeMap: Record<CategoryType, { banner: string; blurb: string }> = {
  accommodation: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.76),rgba(235,247,238,0.82))]",
    blurb: "Elegant villas and stays selected for comfort, style and privacy.",
  },
  night_club: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(240,230,255,0.84))]",
    blurb: "Signature nightlife spots with premium atmosphere and service.",
  },
  activity: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.74),rgba(255,239,216,0.84))]",
    blurb: "High-quality experiences curated for unforgettable Marrakech moments.",
  },
  beach_club: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(217,244,242,0.84))]",
    blurb: "From relaxed poolsides to vibrant day vibes, discover your perfect match.",
  },
  spa: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(245,231,240,0.84))]",
    blurb: "Wellness destinations chosen for calm, care and refined rituals.",
  },
  car_rental: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(228,238,250,0.84))]",
    blurb: "Premium vehicles and smooth booking for effortless city and road travel.",
  },
  tourist_transport: {
    banner: "bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(230,242,255,0.84))]",
    blurb: "Comfort-first transport options for airport, city and private tours.",
  },
};

export function CategoryListPage({
  title,
  type,
  isAccommodation,
  selectedLocation,
  selectedRooms,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 9;
  const theme = categoryThemeMap[type];

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length, loading, page]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const data = await listItems({
        categoryType: type,
        publishedOnly: true,
        location: selectedLocation || undefined,
        rooms: selectedRooms ? Number(selectedRooms) : undefined,
      });
      setItems(data);
      setLoading(false);
    };
    void run();
  }, [selectedLocation, selectedRooms, type]);

  const locations = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.location).filter((v): v is string => Boolean(v)))),
    [items],
  );
  const roomOptions = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.accommodation?.rooms).filter((v): v is number => Boolean(v))),
      ).sort((a, b) => a - b),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(
    () => items.slice((currentPage - 1) * perPage, currentPage * perPage),
    [items, currentPage],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className={`reveal-on-scroll mb-7 ui-shell ui-shell-ornament ${theme.banner}`}>
        <p className="ui-eyebrow mb-2">Signature Selection</p>
        <h1 className="ui-section-title">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600 md:text-base">{theme.blurb}</p>
      </section>
      {isAccommodation && (
        <AccommodationFilters
          locations={locations}
          roomOptions={roomOptions}
          selectedLocation={selectedLocation}
          selectedRooms={selectedRooms}
        />
      )}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl border border-border/70 bg-white/70" />
          ))}
        </div>
      ) : (
        <>
          {!items.length ? (
            <div className="ui-surface p-10 text-center">
              <p className="text-zinc-700">No items available yet.</p>
            </div>
          ) : (
            <div
              className={
                isAccommodation ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              {pagedItems.map((item, index) => {
                const staggerClass = `stagger-${(index % 4) + 1}`;
                return (
                  <div key={item.id} className={`reveal-on-scroll ${staggerClass}`}>
                    {isAccommodation ? <AccommodationCard item={item} /> : <CategoryCard item={item} />}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {!loading && items.length > perPage && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="rounded-full border border-border bg-white/85 px-4 py-2 text-sm transition-all hover:bg-white disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                className={`h-10 w-10 rounded-full border text-sm transition-all ${p === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white/85 hover:bg-white"}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
          })}
          <button
            className="rounded-full border border-border bg-white/85 px-4 py-2 text-sm transition-all hover:bg-white disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

