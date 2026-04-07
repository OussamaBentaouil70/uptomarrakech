import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const footerNav = [
  { href: "/", label: "Home" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/activities", label: "Activities" },
  { href: "/beach-clubs", label: "Beach Clubs" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/uptomarrakech/",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61560347476465",
    label: "Facebook",
    icon: faFacebookF,
  },
  {
    href: "https://www.tiktok.com/@uptomarrakech",
    label: "TikTok",
    icon: faTiktok,
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-[linear-gradient(165deg,rgba(255,250,243,0.9),rgba(245,236,218,0.72))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="group inline-block">
            <div className="relative h-12 w-24 overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <Image 
                src="https://res.cloudinary.com/dj-events101/image/upload/v1775210807/UP-removebg-preview-1-1.png-removebg-preview_fdegio.png" 
                alt="UP" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>
          <p className="ui-subtle">Premium stays, activities and concierge services in Marrakech.</p>
          <p className="text-zinc-700">contact@uptomarrakech.com</p>
          <p className="text-zinc-700">+212 6 99-12 47 35</p>
        </div>

        <div>
          <p className="ui-heading text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600">Navigation</p>
          <nav className="mt-3 grid grid-cols-2 gap-2">
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-zinc-700 transition-colors hover:text-zinc-950">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="ui-heading text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600">Social</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex h-14 w-14 items-center justify-center text-zinc-700 transition-colors hover:text-zinc-950"
              >
                <FontAwesomeIcon icon={item.icon} className="h-7 w-7" />
                <span className="sr-only">{item.label}</span>
              </a>
            ))}
          </div>
          <p className="mt-5 text-zinc-500">Copyright © 2026 UpToMarrakech</p>
        </div>
      </div>
    </footer>
  );
}

