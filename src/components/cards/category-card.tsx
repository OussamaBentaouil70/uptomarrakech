import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Item } from "@/lib/types";
import { categoryPathMap } from "@/lib/category-map";
import type { Locale } from "@/lib/locale";
import { getCategoryLabel, localizePath } from "@/lib/locale";

export function CategoryCard({ item, locale = "en" }: { item: Item; locale?: Locale }) {
  const href = localizePath(`/${categoryPathMap[item.categoryType]}/${item.slug}`, locale);
  const title = locale === "fr" && item.titleFr ? item.titleFr : item.title;
  const excerpt = locale === "fr" && item.excerptFr ? item.excerptFr : item.excerpt;
  const location = locale === "fr" && item.locationFr ? item.locationFr : item.location;

  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:bg-card/80 backdrop-blur-sm">
        <div className="relative h-64 w-full overflow-hidden">
          <Image 
            src={item.coverImage} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          {location && (
            <p className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-800 backdrop-blur-md">
              {location}
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {getCategoryLabel(locale, item.categoryType)}
          </span>
          <h3 className="ui-heading mb-3 text-2xl font-semibold leading-tight">{title}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed mb-6">{excerpt}</p>
          <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary">
            {locale === "fr" ? "Découvrir" : "Discovery"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

