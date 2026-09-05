import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
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
  verification: {
    google: "scTRI76xFbrUt4evt8QnqD29xjohROur4l7N61gK-ZU",
  },
  icons: {
    icon: "/assets/MyMarrakechTrip_logo.ico",
  },
  openGraph: {
    title: "MyMarrakechTrip",
    description: "Activities, accommodation, transport and premium experiences in Marrakech.",
    siteName: "MyMarrakechTrip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyMarrakechTrip",
    description: "Activities, accommodation, transport and premium experiences in Marrakech.",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMPTLXXR');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MMPTLXXR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
