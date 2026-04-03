"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";

export function PublicComponents({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

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