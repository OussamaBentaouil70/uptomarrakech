import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import type { Item } from "@/lib/types";
import { categoryPathMap } from "@/lib/category-map";

export function AccommodationCard({ item }: { item: Item }) {
  return (
    <Link href={`/${categoryPathMap.accommodation}/${item.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-border/75 bg-white/90 shadow-[0_12px_28px_-22px_rgba(30,20,10,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_40px_-24px_rgba(30,20,10,0.55)]">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" />
          {item.location && (
            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
              {item.location}
            </span>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="ui-heading text-2xl font-semibold">{item.title}</h3>
          <div className="flex items-center gap-4 text-zinc-700 text-sm">
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {item.accommodation?.rooms ?? 0} Rooms
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {item.accommodation?.people ?? 0} People
            </div>
          </div>
          <p className="text-zinc-600 line-clamp-3">{item.excerpt}</p>
          <div className="pt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-emerald-900">From {item.price}€ / Night</p>
            <span className="inline-flex rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground transition-all duration-300 group-hover:brightness-110">
              View details
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

