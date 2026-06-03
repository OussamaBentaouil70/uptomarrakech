"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { getLocaleFromPathname } from "@/lib/locale";

export function PublicComponents({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      <SiteBreadcrumbs />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFAB />
    </>
  );
}