"use client";

import { useEffect, useState } from "react";
import { listInquiries, updateInquiryStatus } from "@/lib/firebase/data";
import type { Inquiry } from "@/lib/types";
import { categoryLabelMap } from "@/lib/category-map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Clock, Mail, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await listInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleStatusUpdate = async (id: string, status: Inquiry["status"]) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success("Status updated");
      void refresh();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const getFullName = (inquiry: Inquiry) =>
    [inquiry.firstName, inquiry.lastName].filter(Boolean).join(" ") || inquiry.name || "Unknown";

  const getReservationSlot = (inquiry: Inquiry) => {
    if (inquiry.date && inquiry.time) return `${inquiry.date} at ${inquiry.time}`;
    if (inquiry.date) return inquiry.date;
    if (inquiry.startDate) return `${inquiry.startDate} to ${inquiry.endDate || inquiry.startDate}`;
    return "General inquiry";
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
        <Button onClick={refresh} variant="outline" className="rounded-full">Refresh</Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-card/40 border border-border/40" />
          ))
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center ui-surface">
            <p className="text-muted-foreground">No inquiries found.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="ui-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/40 transition-colors">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{getFullName(inquiry)}</h3>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    inquiry.status === "new" ? "bg-primary text-primary-foreground" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {inquiry.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/60" /> {inquiry.email || "No email"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary/60" /> {inquiry.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/60" /> 
                    {getReservationSlot(inquiry)}
                  </div>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Clock className="h-4 w-4 text-primary/60" /> 
                    Interested in: <span className="text-primary italic font-serif"> {inquiry.itemSlug} </span> ({categoryLabelMap[inquiry.categoryType]})
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border/20 italic text-sm">
                  "{inquiry.message}"
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-end">
                {inquiry.status === "new" && (
                  <Button 
                    onClick={() => handleStatusUpdate(inquiry.id, "closed")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Replied
                  </Button>
                )}
                <Button variant="outline" className="rounded-full border-primary/20 text-primary">
                  <a href={`mailto:${inquiry.email}`}>Reply via Email</a>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
