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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse } from "@fortawesome/free-solid-svg-icons";

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
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  const useTransparentHeader = isMounted && isHomePage && !scrolled;

  return (
    <header 
      className={cn(
        "inset-x-0 top-0 z-50 transition-all duration-500",
        useTransparentHeader
          ? "fixed bg-transparent py-4"
          : "sticky bg-white/90 py-2 shadow-sm supports-backdrop-filter:backdrop-blur-md"
      )}
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group py-1">
            <div className="relative h-14 w-32 overflow-hidden group-hover:scale-105 transition-transform duration-500 md:h-16 md:w-36">
              <Image 
                src="https://res.cloudinary.com/dj-events101/image/upload/v1775210807/UP-removebg-preview-1-1.png-removebg-preview_fdegio.png" 
                alt="UP" 
                fill 
                className={cn(
                  "object-contain transition-[filter] duration-500",
                  useTransparentHeader && "brightness-0 invert",
                )}
              />
            </div>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all lg:hidden",
                useTransparentHeader
                  ? "border-white/60 bg-white/10 text-white supports-backdrop-filter:backdrop-blur-sm hover:bg-white/20"
                  : "border-border/70 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50",
              )}
            >
              <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[86vw] max-w-sm bg-white p-0">
              <SheetHeader className="border-b border-border/60 px-5 py-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-2 p-4">
                {links.map((link) =>
                  link.isDropdown ? (
                    <div key={link.label} className="space-y-2 px-2 py-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {link.label}
                      </p>
                      <div className="space-y-1">
                        {link.subLinks?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group relative flex items-center px-2 py-2 text-sm font-medium transition-colors",
                              "after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300",
                              pathname === sub.href
                                ? "text-zinc-900 after:scale-x-100"
                                : "text-zinc-600 hover:text-zinc-900 hover:after:scale-x-100",
                            )}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      aria-label={link.href === "/" ? "Home" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 px-2 py-2.5 text-sm font-medium transition-colors duration-300",
                        "after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300",
                        pathname === link.href
                          ? "text-zinc-900 after:scale-x-100"
                          : "text-zinc-600 hover:text-zinc-900 hover:after:scale-x-100",
                      )}
                    >
                      {link.href === "/" ? (
                        <>
                          <FontAwesomeIcon icon={faHouse} className="h-4 w-4" />
                          <span>Home</span>
                        </>
                      ) : (
                        link.label
                      )}
                    </Link>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link, idx) => (
              link.isDropdown ? (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-300 outline-none",
                    "after:absolute after:-bottom-0.5 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-300",
                    pathname.startsWith("/transport") 
                      ? useTransparentHeader
                        ? "text-white after:bg-white after:scale-x-100"
                        : "text-zinc-800 after:bg-zinc-900 after:scale-x-100"
                      : useTransparentHeader
                        ? "text-white/90 hover:text-white after:bg-white hover:after:scale-x-100"
                        : "text-zinc-700 hover:text-zinc-900 after:bg-zinc-900 hover:after:scale-x-100"
                  )}>
                    {link.label} <ChevronDown className={cn("h-3 w-3 transition-transform group-data-open:rotate-180", useTransparentHeader ? "opacity-75" : "opacity-50")} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border-border/40 animate-in fade-in zoom-in-95 duration-200">
                    {link.subLinks?.map((sub) => (
                      <DropdownMenuItem
                        key={sub.href}
                        className="p-0 rounded-xl overflow-hidden bg-white text-zinc-700 hover:bg-black hover:text-zinc-950 focus:bg-white focus:text-zinc-950 data-highlighted:bg-white data-highlighted:text-zinc-950"
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
                  aria-label={link.href === "/" ? "Home" : undefined}
                  className={cn(
                    "group relative px-3 py-2 text-sm font-medium transition-colors duration-300",
                    "after:absolute after:-bottom-0.5 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-300",
                    link.href === "/" && "inline-flex items-center justify-center",
                    pathname === link.href
                      ? useTransparentHeader
                        ? "text-white after:bg-white after:scale-x-100"
                        : "text-zinc-800 after:bg-zinc-900 after:scale-x-100"
                      : useTransparentHeader
                        ? "text-white/90 hover:text-white after:bg-white hover:after:scale-x-100"
                        : "text-zinc-700 hover:text-zinc-900 after:bg-zinc-900 hover:after:scale-x-100",
                  )}
                >
                  {link.href === "/" ? (
                    <>
                      <FontAwesomeIcon icon={faHouse} className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </>
                  ) : (
                    link.label
                  )}
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

