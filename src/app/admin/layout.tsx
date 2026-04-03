"use client";

import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#FDFCFB]">
        <AdminSidebar />
        <main className="flex-1 lg:pl-72">
          <SiteBreadcrumbs />
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
