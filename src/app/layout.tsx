import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter, MobileCTA } from "@/components/layout";
import { HideOnAdmin } from "@/components/HideOnAdmin";
import { Analytics } from "@/components/Analytics";
import { siteUrl } from "@/lib/site";
import { getLocale } from "@/i18n/dictionaries";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Lombok Local — Explore Lombok Your Way",
    template: "%s · Lombok Local",
  },
  description:
    "Tours, scooter rental, car rental and local experiences in Lombok. Book directly via WhatsApp.",
  metadataBase: new URL(siteUrl()),
  openGraph: {
    title: "Lombok Local — Explore Lombok Your Way",
    description: "Tours, rentals and local experiences made simple.",
    type: "website",
    locale: "en_US",
    siteName: "Lombok Local",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "geo.region": "ID-NB",
    "geo.placename": "Kuta, Lombok",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-sand text-ink">
        {children}
        <SiteFooter />
        <HideOnAdmin>
          <MobileCTA />
        </HideOnAdmin>
        <Analytics />
      </body>
    </html>
  );
}
