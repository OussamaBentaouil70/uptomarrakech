"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: `/${categoryPathMap.accommodation}`, label: categoryLabelMap.accommodation },
  { href: `/${categoryPathMap.activity}`, label: categoryLabelMap.activity },
  { href: `/${categoryPathMap.beach_club}`, label: categoryLabelMap.beach_club },
  { href: `/${categoryPathMap.night_club}`, label: categoryLabelMap.night_club },
  { href: `/${categoryPathMap.restaurant}`, label: categoryLabelMap.restaurant },
  { 
    label: "Transportation", 
    isDropdown: true,
    subLinks: [
      { href: "/transport/car-rental", label: "Car Rental" },
      { href: "/transport/tourist-transport", label: "Tourist Transport" },
    ]
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-500",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-white py-4"
    )}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group py-1">
            <div className="relative h-12 w-24 overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <Image 
                src="https://res.cloudinary.com/dj-events101/image/upload/v1775210807/UP-removebg-preview-1-1.png-removebg-preview_fdegio.png" 
                alt="UP" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link, idx) => (
              link.isDropdown ? (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 outline-none",
                    pathname.startsWith("/transport") 
                      ? "bg-zinc-900 text-white" 
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  )}>
                    {link.label} <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-data-open:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border-border/40 animate-in fade-in zoom-in-95 duration-200">
                    {link.subLinks?.map((sub) => (
                      <DropdownMenuItem
                        key={sub.href}
                        className="p-0 rounded-xl overflow-hidden bg-white text-zinc-700 hover:bg-white hover:text-zinc-950 focus:bg-white focus:text-zinc-950 data-highlighted:bg-white data-highlighted:text-zinc-950"
                      >
                        <Link 
                          href={sub.href}
                          className={cn(
                              "flex w-full items-center px-4 py-2.5 text-sm transition-colors bg-white text-zinc-700 hover:bg-white hover:text-zinc-950",
                              pathname === sub.href
                                ? "bg-primary/10 text-primary font-semibold"
                                : ""
                          )}
                        >
                          {sub.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    pathname === link.href
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
                  )}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
          {links.map((link, idx) => (
             link.isDropdown ? (
               link.subLinks?.map((sub) => (
                 <Link
                   key={sub.href}
                   href={sub.href}
                   className={cn(
                     "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
                     pathname === sub.href
                       ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-black/10"
                       : "border-border/60 bg-white text-zinc-700",
                   )}
                 >
                   {sub.label}
                 </Link>
               ))
             ) : (
               <Link
                key={link.href}
                href={link.href!}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
                  pathname === link.href
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-black/10"
                    : "border-border/60 bg-white text-zinc-700",
                )}
              >
                {link.label}
              </Link>
             )
          ))}
        </nav>
      </div>
    </header>
  );
}

