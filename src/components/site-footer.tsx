import Image from "next/image";
import Link from "next/link";

const footerNav = [
  { href: "/", label: "Home" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/activities", label: "Activities" },
  { href: "/beach-clubs", label: "Beach Clubs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://tiktok.com", label: "TikTok" },
  { href: "https://wa.me/212699124735", label: "WhatsApp" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-[linear-gradient(165deg,rgba(255,250,243,0.9),rgba(245,236,218,0.72))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border/80 bg-white p-1">
              <Image src="/assets/images/uptomarrakech.png" alt="UpToMarrakech" fill className="object-contain" />
            </div>
            <p className="ui-heading text-lg font-semibold">UpToMarrakech</p>
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
                className="rounded-full border border-border/70 bg-white/85 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:bg-white hover:text-zinc-950"
              >
                {item.label}
              </a>
            ))}
          </div>
          <p className="mt-5 text-zinc-500">Copyright © 2026 UpToMarrakech</p>
        </div>
      </div>
    </footer>
  );
}

