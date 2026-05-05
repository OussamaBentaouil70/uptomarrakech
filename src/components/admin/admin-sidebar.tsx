"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Inbox,
  Newspaper,
  Home,
  Sparkles,
  Moon,
  Sun,
  Car,
  Flower2,
  Utensils,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Inbox, label: "Inquiries", href: "/admin/inquiries" },
  { icon: UserPlus, label: "Admins", href: "/admin/users" },
  { icon: Newspaper, label: "Blogs", href: "/admin/blogs" },
  { type: "divider", label: "Categories" },
  { icon: Home, label: "Accommodation", href: "/admin/items?type=accommodation" },
  { icon: Sparkles, label: "Activities", href: "/admin/items?type=activity" },
  { icon: Moon, label: "Night Clubs", href: "/admin/items?type=night_club" },
  { icon: Sun, label: "Beach Clubs", href: "/admin/items?type=beach_club" },
  { icon: Car, label: "Car Rental", href: "/admin/items?type=car_rental" },
  { icon: Car, label: "Tourist Transport", href: "/admin/items?type=tourist_transport" },
  { icon: Flower2, label: "SPAs", href: "/admin/items?type=spa" },
  { icon: Utensils, label: "Restaurants", href: "/admin/items?type=restaurant" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl lg:flex">
      <div className="flex h-32 items-center px-8 border-b border-border/40">
        <Link href="/" className="group w-full h-24 relative overflow-hidden transition-transform duration-500 hover:scale-105">
          <Image 
            src="https://i.postimg.cc/L8kqSsCc/logo-mymarrakechtrip.webp" 
            alt="MyMarrakechTrip" 
            fill 
            className="object-contain object-left" 
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item, idx) => {
          if (item.type === "divider") {
            return (
              <div key={idx} className="px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {item.label}
                </p>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = pathname === item.href;

          return (
            <Link
              key={idx}
              href={item.href!}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-primary/10",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-primary/60 group-hover:text-primary")} />
                {item.label}
              </div>
              <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all group-hover:opacity-100", isActive && "opacity-100")} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <button
          onClick={() => signOut(getClientAuth())}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 active:scale-95 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
