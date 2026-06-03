export type Locale = "en" | "fr";

export function getLocaleFromPathname(pathname?: string | null): Locale {
  return pathname?.startsWith("/fr") ? "fr" : "en";
}

export function stripLocalePrefix(pathname: string): string {
  if (!pathname.startsWith("/fr")) return pathname;
  const stripped = pathname.replace(/^\/fr(?=\/|$)/, "");
  return stripped || "/";
}

export function localizePath(pathname: string, locale: Locale): string {
  const basePath = stripLocalePrefix(pathname);
  if (locale === "fr") {
    return basePath === "/" ? "/fr" : `/fr${basePath}`;
  }
  return basePath;
}

export function isFrenchPathname(pathname?: string | null): boolean {
  return getLocaleFromPathname(pathname) === "fr";
}

export function getCategoryLabel(locale: Locale, categoryType: string): string {
  const labels: Record<string, string> = {
    accommodation: locale === "fr" ? "Hébergement" : "Accommodation",
    night_club: locale === "fr" ? "Club de nuit" : "Night Club",
    activity: locale === "fr" ? "Activité" : "Activity",
    beach_club: locale === "fr" ? "Beach Club" : "Beach Club",
    restaurant: locale === "fr" ? "Restaurant" : "Restaurant",
    car_rental: locale === "fr" ? "Location de voiture" : "Car Rental",
    tourist_transport: locale === "fr" ? "Transport touristique" : "Tourist Transport",
    spa: locale === "fr" ? "Spa" : "Spa",
  };

  return labels[categoryType] || categoryType;
}
