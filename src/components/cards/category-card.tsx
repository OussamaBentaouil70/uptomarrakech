import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Item } from "@/lib/types";
import { categoryPathMap } from "@/lib/category-map";

export function CategoryCard({ item }: { item: Item }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/75 bg-white/90 shadow-[0_12px_28px_-22px_rgba(30,20,10,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_40px_-24px_rgba(30,20,10,0.55)]">
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={item.coverImage} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
        {item.location && (
          <p className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
            {item.location}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6 text-center">
        <h3 className="ui-heading text-2xl font-semibold">{item.title}</h3>
        <p className="line-clamp-3 text-zinc-700 leading-relaxed">{item.excerpt}</p>
        <Link
          className="mt-auto inline-flex items-center gap-2 self-center rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground transition-all duration-300 hover:brightness-110"
          href={`/${categoryPathMap[item.categoryType]}/${item.slug}`}
        >
          Discover <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

