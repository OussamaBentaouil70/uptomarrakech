import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { PublicComponents } from "@/components/public-components";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-modern",
  subsets: ["latin"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyMarrakechTrip",
  description: "Votre expérience exclusive à Marrakech commence ici.",
  metadataBase: new URL("https://mymarrakechtrip.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MyMarrakechTrip",
    description: "Activities, accommodation, transport and premium experiences in Marrakech.",
    siteName: "MyMarrakechTrip",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {/* PublicComponents currently renders Header, Footer, and FAB. 
              To fix the order, we need the Header here, then children, then Footer. */}
          <PublicComponents>
            <div className="flex-1 flex flex-col">{children}</div>
          </PublicComponents>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
