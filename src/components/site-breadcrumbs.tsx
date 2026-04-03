"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const segmentLabelMap: Record<string, string> = {
  accommodation: "Accommodation",
  activities: "Activities",
  "beach-clubs": "Beach Clubs",
  "night-clubs": "Night Clubs",
  restaurants: "Restaurants",
  spa: "Spa",
  transport: "Transport",
  "car-rental": "Car Rental",
  "tourist-transport": "Tourist Transport",
  blog: "Blog",
  contact: "Contact",
};

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SiteBreadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = segmentLabelMap[segment] || toTitleCase(decodeURIComponent(segment));
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-xs sm:text-sm">
        <Link href="/" className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <div key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              {isLast ? (
                <span className="whitespace-nowrap font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
