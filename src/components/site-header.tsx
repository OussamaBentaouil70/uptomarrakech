"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: `/${categoryPathMap.accommodation}`, label: categoryLabelMap.accommodation },
  { href: `/${categoryPathMap.activity}`, label: categoryLabelMap.activity },
  { href: `/${categoryPathMap.beach_club}`, label: categoryLabelMap.beach_club },
  { href: `/${categoryPathMap.night_club}`, label: categoryLabelMap.night_club },
  { href: "/transport/car-rental", label: "Transport" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border/80 bg-white p-1 shadow-sm sm:h-12 sm:w-12">
              <Image src="/assets/images/uptomarrakech.png" alt="UpToMarrakech" fill className="object-contain" />
            </div>
            <div className="leading-tight">
              <p className="ui-heading text-lg font-semibold sm:text-xl">UpToMarrakech</p>
              <p className="ui-subtle text-[10px] uppercase tracking-[0.14em] sm:text-[11px]">Premium Experiences</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1.5 text-sm lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 transition-all duration-300",
                  pathname === link.href
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-all duration-300",
                pathname === link.href
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-border/70 bg-white text-zinc-700",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

