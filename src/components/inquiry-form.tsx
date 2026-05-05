"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "@/lib/firebase/data";
import { inquirySchema, type InquiryInput } from "@/lib/validation/schemas";
import { toast } from "sonner";
import type { CategoryType } from "@/lib/types";
import { sendFormEmail } from "@/lib/forms/mailer";

type Props = {
  itemId: string;
  itemSlug: string;
  categoryType: CategoryType;
};

export function InquiryForm({ itemId, itemSlug, categoryType }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
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
      await sendFormEmail({
        formType: "reservation",
        contact_name: `${values.firstName} ${values.lastName}`.trim(),
        contact_email: values.email,
        contact_phone: values.phone,
        service_type: values.categoryType,
        preferred_date: values.date,
        preferred_time: values.time,
        item_slug: values.itemSlug,
        category_type: values.categoryType,
        message: values.message,
      });
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
      router.push("/thank-you?type=reservation");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  const errors = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1">
        <h3 className="ui-heading text-2xl font-semibold tracking-tight">Reservation request</h3>
        <p className="text-sm text-muted-foreground">
          Fill in your details and our concierge team will contact you quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-first-name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            First name
          </Label>
          <Input
            id="inquiry-first-name"
            className="h-11 border-border/60 bg-background px-4"
            placeholder="First name"
            {...form.register("firstName")}
          />
          {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inquiry-last-name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Last name
          </Label>
          <Input
            id="inquiry-last-name"
            className="h-11 border-border/60 bg-background px-4"
            placeholder="Last name"
            {...form.register("lastName")}
          />
          {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-phone" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
          Phone
        </Label>
        <Input
          id="inquiry-phone"
          className="h-11 border-border/60 bg-background px-4"
          placeholder="+212 ..."
          {...form.register("phone")}
        />
        {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-email" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
          Email
        </Label>
        <Input
          id="inquiry-email"
          className="h-11 border-border/60 bg-background px-4"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-date" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Date
          </Label>
          <Input
            id="inquiry-date"
            className="h-11 border-border/60 bg-background px-4"
            type="date"
            {...form.register("date")}
          />
          {errors.date && <p className="text-xs text-red-600">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inquiry-time" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Time
          </Label>
          <Input
            id="inquiry-time"
            className="h-11 border-border/60 bg-background px-4"
            type="time"
            {...form.register("time")}
          />
          {errors.time && <p className="text-xs text-red-600">{errors.time.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-message" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
          Message
        </Label>
        <Textarea
          id="inquiry-message"
          className="min-h-32 border-border/60 bg-background px-4 py-3"
          rows={6}
          placeholder="Tell us what you need: number of guests, special requests, preferred time..."
          {...form.register("message")}
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className={`h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:brightness-110 ${
          submitting ? 'cursor-wait opacity-80' : 'cursor-pointer'
        }`}
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send reservation'
        )}
      </Button>
    </form>
  );
}

