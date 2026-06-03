"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryLabelMap, categoryPathMap } from "@/lib/category-map";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getLocaleFromPathname, localizePath, stripLocalePrefix, type Locale } from "@/lib/locale";

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
  const isHomePage = stripLocalePrefix(pathname) === "/";
  const locale = getLocaleFromPathname(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hrefFor = (href: string, nextLocale: Locale = locale) => localizePath(href, nextLocale);
  const isCurrentPath = (href: string) => stripLocalePrefix(pathname) === href;
  const saveLocale = (nextLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useTransparentHeader = isHomePage && !scrolled;

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
          <Link href={hrefFor("/")} className="group py-1">
            <div className="relative h-20 w-48 overflow-hidden group-hover:scale-105 transition-transform duration-500 md:h-24 md:w-56">
              <Image 
                src="/assets/images/logo_mymarrakechtrip.png" 
                alt="MyMarrakechTrip" 
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
                            href={hrefFor(sub.href)}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group relative flex items-center px-2 py-2 text-sm font-medium transition-colors",
                              "after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300",
                              isCurrentPath(sub.href)
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
                      href={hrefFor(link.href!)}
                      aria-label={link.href === "/" ? "Home" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 px-2 py-2.5 text-sm font-medium transition-colors duration-300",
                        "after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:rounded-full after:bg-zinc-900 after:transition-transform after:duration-300",
                        isCurrentPath(link.href!)
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
               <div className="mt-6 px-5">
                 <DropdownMenu>
                   <DropdownMenuTrigger
                     className={cn(
                       "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-300 outline-none",
                       useTransparentHeader
                         ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                         : "border-border/70 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50",
                     )}
                   >
                     <span className={cn("fi h-4 w-4 rounded-sm", locale === "fr" ? "fi-fr" : "fi-gb")}></span>
                     <span className="hidden xl:inline">{locale === "fr" ? "FR" : "EN"}</span>
                     <ChevronDown className="h-3 w-3 opacity-60" />
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-36 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border-border/40">
                     <DropdownMenuItem className="p-0 rounded-xl overflow-hidden">
                       <Link href={hrefFor(pathname, "en")} onClick={() => saveLocale("en")} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-black hover:text-white">
                         <span className="fi fi-gb h-4 w-4 rounded-sm" />
                         English
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem className="p-0 rounded-xl overflow-hidden">
                       <Link href={hrefFor(pathname, "fr")} onClick={() => saveLocale("fr")} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-black hover:text-white">
                         <span className="fi fi-fr h-4 w-4 rounded-sm" />
                         Français
                       </Link>
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
             </SheetContent>
          </Sheet>

           <nav className="hidden items-center gap-1 lg:flex">
             <>
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
                           className="p-0 rounded-xl overflow-hidden bg-white text-zinc-700 hover:bg-black hover:text-white focus:bg-white focus:text-zinc-950 data-highlighted:bg-black data-highlighted:text-white"
                         >
                           <Link 
                             href={hrefFor(sub.href)}
                             className={cn(
                               "flex w-full items-center px-4 py-2.5 text-sm transition-colors bg-white text-zinc-700 hover:bg-black hover:text-white",
                               isCurrentPath(sub.href)
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
                     href={hrefFor(link.href!)}
                     aria-label={link.href === "/" ? "Home" : undefined}
                     className={cn(
                       "group relative px-3 py-2 text-sm font-medium transition-colors duration-300",
                       "after:absolute after:-bottom-0.5 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-300",
                       link.href === "/" && "inline-flex items-center justify-center",
                       isCurrentPath(link.href!)
                         ? useTransparentHeader
                           ? "text-white after:bg-white after:scale-x-100"
                           : "text-zinc-800 after:bg-zinc-900 after:scale-x-100"
                         : useTransparentHeader
                           ? "text-white/90 hover:text-white after:bg-white hover:after:scale-x-100"
                           : "text-zinc-700 hover:text-zinc-900 after:bg-zinc-900 hover:after:scale-x-100"
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
               <DropdownMenu key="language-dropdown">
                 <DropdownMenuTrigger
                   className={cn(
                     "ml-2 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-300 outline-none",
                     useTransparentHeader
                       ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                       : "border-border/70 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50",
                   )}
                 >
                   <span className={cn("fi h-4 w-4 rounded-sm", locale === "fr" ? "fi-fr" : "fi-gb")}></span>
                   <span className="hidden xl:inline">{locale === "fr" ? "FR" : "EN"}</span>
                   <ChevronDown className="h-3 w-3 opacity-60" />
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-36 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border-border/40">
                   <DropdownMenuItem className="p-0 rounded-xl overflow-hidden">
                     <Link href={hrefFor(pathname, "en")} onClick={() => saveLocale("en")} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-black hover:text-white">
                       <span className="fi fi-gb h-4 w-4 rounded-sm" />
                       English
                     </Link>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="p-0 rounded-xl overflow-hidden">
                     <Link href={hrefFor(pathname, "fr")} onClick={() => saveLocale("fr")} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-black hover:text-white">
                       <span className="fi fi-fr h-4 w-4 rounded-sm" />
                       Français
                     </Link>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             </>
           </nav>


        </div>
      </div>
    </header>
  );
}

