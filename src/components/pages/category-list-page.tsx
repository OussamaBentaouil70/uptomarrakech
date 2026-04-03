"use client";

import { useEffect, useMemo, useState } from "react";
import { listItems } from "@/lib/firebase/data";
import type { CategoryType, Item } from "@/lib/types";
import { CategoryCard } from "@/components/cards/category-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { AccommodationFilters } from "@/components/accommodation-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  type: CategoryType;
  isAccommodation?: boolean;
  selectedLocation?: string;
  selectedRooms?: string;
};

const categoryThemeMap: Record<CategoryType, { banner: string; blurb: string }> = {
  accommodation: {
    banner: "bg-primary/5",
    blurb: "Elegant villas and stays selected for comfort, style and privacy.",
  },
  night_club: {
    banner: "bg-primary/5",
    blurb: "Signature nightlife spots with premium atmosphere and service.",
  },
  activity: {
    banner: "bg-primary/5",
    blurb: "High-quality experiences curated for unforgettable Marrakech moments.",
  },
  beach_club: {
    banner: "bg-primary/5",
    blurb: "From relaxed poolsides to vibrant day vibes, discover your perfect match.",
  },
  spa: {
    banner: "bg-primary/5",
    blurb: "Wellness destinations chosen for calm, care and refined rituals.",
  },
  car_rental: {
    banner: "bg-primary/5",
    blurb: "Premium vehicles and smooth booking for effortless city and road travel.",
  },
  tourist_transport: {
    banner: "bg-primary/5",
    blurb: "Comfort-first transport options for airport, city and private tours.",
  },
  restaurant: {
    banner: "bg-primary/5",
    blurb: "A journey through the finest flavors and most exclusive dining settings.",
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
  const theme = categoryThemeMap[type] || categoryThemeMap.activity;

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
    <main className="bg-background min-h-screen">
      <section className={cn("py-20 px-6 text-center border-b border-border/40", theme.banner)}>
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            The Collection
          </span>
          <h1 className="ui-display text-5xl md:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground italic font-serif text-lg">
            {theme.blurb}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {isAccommodation && (
          <div className="mb-12">
            <AccommodationFilters
              locations={locations}
              roomOptions={roomOptions}
              selectedLocation={selectedLocation}
              selectedRooms={selectedRooms}
            />
          </div>
        )}

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-3xl bg-card/40 border border-border/40" />
            ))}
          </div>
        ) : (
          <>
            {!items.length ? (
              <div className="ui-surface p-20 text-center space-y-4">
                <p className="text-muted-foreground font-serif italic text-xl">Aucun résultat trouvé pour cette sélection.</p>
                <Button variant="ghost" onClick={() => window.location.reload()}>Reset filters</Button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pagedItems.map((item, index) => (
                  <div key={item.id} className="animate-reveal" style={{ animationDelay: `${index * 100}ms` }}>
                    {isAccommodation ? <AccommodationCard item={item} /> : <CategoryCard item={item} />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && items.length > perPage && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full px-6"
              disabled={currentPage <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={cn(
                      "h-10 w-10 rounded-full text-xs font-bold transition-all",
                      p === currentPage 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "hover:bg-primary/10 text-muted-foreground"
                    )}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="rounded-full px-6"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

