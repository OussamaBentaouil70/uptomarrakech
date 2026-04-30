"use client";

import { useEffect, useState } from "react";
import { listItems, listInquiries, listCategories } from "@/lib/firebase/data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Category, Inquiry, Item } from "@/lib/types";
import { categoryLabelMap } from "@/lib/category-map";
import { 
  Users, 
  Package, 
  Inbox, 
  Layers, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    items: 0,
    inquiries: 0,
    categories: 0,
    admins: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [items, inqs, cats, adminsSnap] = await Promise.all([
        listItems(),
        listInquiries(),
        listCategories(),
        getDocs(collection(db, "admins"))
      ]);
      
      setStats({
        items: items.length,
        inquiries: inqs.length,
        categories: cats.length,
        admins: adminsSnap.size
      });
      setRecentInquiries(inqs.slice(0, 5));
      setLoading(false);
    }
    void loadStats();
  }, []);

  const statCards = [
    { label: "Total Items", value: stats.items, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Inquiries", value: stats.inquiries, icon: Inbox, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Categories", value: stats.categories, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "System Admins", value: stats.admins, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const getFullName = (inq: Inquiry) =>
    [inq.firstName, inq.lastName].filter(Boolean).join(" ") || inq.name || "Unknown";

  return (
    <div className="p-8 space-y-8 animate-reveal">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back to the MyMarrakechTrip control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="ui-surface p-6 flex items-center justify-between group hover:border-primary/40 transition-all">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Recent Inquiries
            </h2>
            <Button variant="ghost" size="sm">
              <Link href="/admin/inquiries" className="text-primary flex items-center">View all <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          
          <div className="ui-surface divide-y divide-border/20 overflow-hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse bg-muted/20" />
              ))
            ) : recentInquiries.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No recent inquiries to show.</div>
            ) : (
              recentInquiries.map((inq) => {
                const fullName = getFullName(inq);

                return (
                  <div key={inq.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{fullName}</p>
                        <p className="text-xs text-muted-foreground">{inq.itemSlug} • {categoryLabelMap[inq.categoryType]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${inq.status === 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {inq.status}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Management Hub
          </h2>
          <div className="grid gap-3">
            {[
              { label: "Items Inventory", href: "/admin/items", icon: Package, desc: "CRUD activities, villas, etc." },
              { label: "Category Settings", href: "/admin/categories", icon: Layers, desc: "Page hero images & sorting" },
              { label: "Access Control", href: "/admin/users", icon: Users, desc: "Manage administrative emails" }
            ].map((link, i) => (
              <Link key={i} href={link.href} className="ui-surface p-4 flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
