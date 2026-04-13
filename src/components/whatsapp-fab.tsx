"use client";

import Image from "next/image";
import Link from "next/link";

export function WhatsAppFAB() {
  const phoneNumber = "212699124735";
  const message = "Hello, I would like to inquire about your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-100 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group animate-float-y"
      aria-label="Contact us on WhatsApp"
    >
      {/* Background glow effect */}
      <div className="absolute -inset-2 rounded-full bg-[#25D366] opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />

      {/* Official WhatsApp Icon */}
      <div className="relative h-10 w-10">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/3840px-WhatsApp.svg.png"
          alt="WhatsApp"
          fill
          className="object-contain"
          priority
        />
      </div>

      <span className="absolute right-full mr-4 hidden whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100 lg:block">
        Chat with us
      </span>
    </Link>
  );
}