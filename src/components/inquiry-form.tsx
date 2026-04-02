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
      name: "",
      phone: "",
      email: "",
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
        name: "",
        phone: "",
        email: "",
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
    <form onSubmit={onSubmit} className="ui-surface space-y-3 p-4">
      <h3 className="ui-heading text-xl font-semibold">Reservation request</h3>
      <Input placeholder="Full name" {...form.register("name")} />
      <Input placeholder="Phone" {...form.register("phone")} />
      <Input placeholder="Email (optional)" {...form.register("email")} />
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" {...form.register("startDate")} />
        <Input type="date" {...form.register("endDate")} />
      </div>
      <Textarea rows={4} placeholder="Message" {...form.register("message")} />
      <Button disabled={submitting} className="w-full bg-primary text-primary-foreground hover:brightness-110">
        {submitting ? "Sending..." : "Send reservation"}
      </Button>
    </form>
  );
}

