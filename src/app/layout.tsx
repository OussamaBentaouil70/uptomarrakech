import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-modern",
  subsets: ["latin"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UpToMarrakech",
  description: "Votre expérience exclusive à Marrakech commence ici.",
  metadataBase: new URL("https://uptomarrakech.com"),
  openGraph: {
    title: "UpToMarrakech",
    description: "Activities, accommodation, transport and premium experiences in Marrakech.",
    siteName: "UpToMarrakech",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
