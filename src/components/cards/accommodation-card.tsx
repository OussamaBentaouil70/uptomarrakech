import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users, ArrowRight } from "lucide-react";
import type { Item } from "@/lib/types";
import { categoryPathMap } from "@/lib/category-map";

export function AccommodationCard({ item }: { item: Item }) {
  return (
    <Link href={`/${categoryPathMap.accommodation}/${item.slug}`} className="group block">
      <article className="overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          {item.location && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-800 backdrop-blur-md">
              {item.location}
            </span>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Signature Villa</span>
            <h3 className="ui-heading text-2xl font-semibold leading-tight">{item.title}</h3>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-primary/60" /> {item.accommodation?.rooms ?? 0} Rooms
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary/60" /> {item.accommodation?.people ?? 0} Guests
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{item.excerpt}</p>
          
          <div className="pt-2 flex items-center justify-between border-t border-border/40">
            <p className="text-xl font-bold text-foreground">
              {item.price}€<span className="text-xs font-normal text-muted-foreground ml-1">/ night</span>
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

