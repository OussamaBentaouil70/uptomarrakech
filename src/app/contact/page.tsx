"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { sendFormEmail } from "@/lib/forms/mailer";

const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  message: z.string().min(10, "Please enter at least 10 characters"),
});

type ContactFormInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await sendFormEmail({
        formType: "contact",
        contact_name: values.fullName,
        contact_email: values.email,
        contact_phone: values.phone,
        service_type: "General Contact",
        message: values.message,
      });

      toast.success("Your message was sent successfully.");
      form.reset();
      router.push("/thank-you?type=contact");
    } catch (error) {
      console.error(error);
      toast.error("We could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  const errors = form.formState.errors;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-12 space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-border/50 bg-[linear-gradient(150deg,rgba(255,255,255,0.82),rgba(248,238,221,0.92))] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <p className="ui-eyebrow mb-3">Begin Your Journey</p>
            <h1 className="ui-section-title max-w-xl">Contact</h1>
            <p className="ui-prose mt-4 max-w-xl text-base sm:text-lg">
              Tell us what you want to book in Marrakech and we will get back to you quickly.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast reply", value: "Within 24h" },
                { label: "Local team", value: "Marrakech based" },
                { label: "Support", value: "7 days a week" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-80 lg:min-h-full">
            <Image
              src="https://images.pexels.com/photos/16188292/pexels-photo-16188292.jpeg"
              alt="Marrakech skyline at sunset"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Marrakech Vibes</p>
              <p className="mt-2 max-w-md text-sm text-white/85">
                Rich textures, warm light and the spirit of the red city set the tone for your next experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <form onSubmit={onSubmit} className="ui-surface space-y-3 p-5 sm:p-6">
          <p className="ui-eyebrow mb-2">Send a message</p>

          <input
            className="w-full rounded-xl border border-border bg-white/90 p-3"
            placeholder="Full name"
            {...form.register("fullName")}
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}

          <input
            className="w-full rounded-xl border border-border bg-white/90 p-3"
            placeholder="Email"
            type="email"
            {...form.register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}

          <input
            className="w-full rounded-xl border border-border bg-white/90 p-3"
            placeholder="Phone"
            {...form.register("phone")}
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}

          <textarea
            className="min-h-32 w-full rounded-xl border border-border bg-white/90 p-3"
            placeholder="Message"
            {...form.register("message")}
          />
          {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="ui-surface-soft space-y-4 p-5 sm:p-6">
          <p className="ui-heading text-lg font-semibold">MyMarrakechTrip</p>
          <p className="text-zinc-700">Email: contact@mymarrakechtrip.com</p>
          <p className="text-zinc-700">Phone: +212 6 99-12 47 35</p>
          <p className="text-zinc-700">Address: Marrakech, Morocco</p>

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-border/50">
            <Image
              src="https://images.pexels.com/photos/30682505/pexels-photo-30682505.jpeg"
              alt="Marrakech city scene"
              width={1200}
              height={800}
              className="h-56 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
