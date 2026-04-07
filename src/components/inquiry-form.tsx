"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "@/lib/firebase/data";
import { inquirySchema, type InquiryInput } from "@/lib/validation/schemas";
import { toast } from "sonner";
import type { CategoryType } from "@/lib/types";

type Props = {
  itemId: string;
  itemSlug: string;
  categoryType: CategoryType;
};

export function InquiryForm({ itemId, itemSlug, categoryType }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      itemId,
      itemSlug,
      categoryType,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await createInquiry(values);
      toast.success("Reservation request sent.");
      form.reset({
        itemId,
        itemSlug,
        categoryType,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="ui-surface space-y-4 p-6 md:p-7">
      <h3 className="ui-heading text-2xl font-semibold">Reservation request</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input className="h-11 px-4" placeholder="First name" {...form.register("firstName")} />
        <Input className="h-11 px-4" placeholder="Last name" {...form.register("lastName")} />
      </div>
      <Input className="h-11 px-4" placeholder="Phone" {...form.register("phone")} />
      <Input className="h-11 px-4" placeholder="Email" type="email" {...form.register("email")} />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Date
          </label>
          <Input className="h-11 px-4" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Time
          </label>
          <Input className="h-11 px-4" type="time" {...form.register("time")} />
        </div>
      </div>
      <Textarea className="min-h-40 px-4 py-3" rows={7} placeholder="Message" {...form.register("message")} />
      <Button disabled={submitting} className="h-12 w-full bg-primary text-base text-primary-foreground hover:brightness-110">
        {submitting ? "Sending..." : "Send reservation"}
      </Button>
    </form>
  );
}

