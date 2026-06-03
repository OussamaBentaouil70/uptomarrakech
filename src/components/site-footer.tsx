"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, localizePath } from "@/lib/locale";

const footerNav = [
  { href: "/", label: "Home" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/activities", label: "Activities" },
  { href: "/beach-clubs", label: "Beach Clubs" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const whatsappNumber = "+212 771-444668";
const whatsappHref = "https://wa.me/212771444668";

export function SiteFooter() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <footer className="mt-20 border-t border-border/70 bg-[linear-gradient(165deg,rgba(255,250,243,0.9),rgba(245,236,218,0.72))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <Link href={localizePath("/", locale)} className="group inline-block">
            <div className="relative h-32 w-64 overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="/assets/images/logo_mymarrakechtrip.png" 
                alt="MyMarrakechTrip" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>
          <p className="ui-subtle">
            {locale === "fr"
              ? "Séjours premium, activités et services de conciergerie à Marrakech."
              : "Premium stays, activities and concierge services in Marrakech."}
          </p>
          <p className="text-zinc-700">contact@mymarrakechtrip.com</p>
          <p className="text-zinc-700">{whatsappNumber}</p>
        </div>

        <div>
          <p className="ui-heading text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600">{locale === "fr" ? "Navigation" : "Navigation"}</p>
          <nav className="mt-3 grid grid-cols-2 gap-2">
            {footerNav.map((item) => (
              <Link key={item.href} href={localizePath(item.href, locale)} className="text-zinc-700 transition-colors hover:text-zinc-950">
                {locale === "fr"
                  ? {
                      Home: "Accueil",
                      Accommodation: "Hébergement",
                      Activities: "Activités",
                      "Beach Clubs": "Beach Clubs",
                      Restaurants: "Restaurants",
                      Blog: "Blog",
                      Contact: "Contact",
                    }[item.label] || item.label
                  : item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="ui-heading text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600">
            {locale === "fr" ? "Contact direct" : "Direct contact"}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label={locale === "fr" ? "Contacter sur WhatsApp" : "Contact on WhatsApp"}
            className="mt-4 inline-flex items-center gap-3 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
            <span>WhatsApp</span>
          </a>
          <p className="mt-5 text-zinc-500">Copyright © 2026 MyMarrakechTrip</p>
        </div>
      </div>
    </footer>
  );
}

