import { siteUrl } from "@/lib/site";
import { getSiteSettings, getWhatsappNumber } from "@/lib/settings";

/**
 * Schema.org TouristInformationCenter — sinyal local SEO:
 * alamat Kuta, geo, jam buka, area layanan, link sosial.
 * Render sekali di homepage.
 */
export async function LocalBusinessJsonLd() {
  const [settings, number] = await Promise.all([
    getSiteSettings().catch(() => null),
    getWhatsappNumber().catch(() => ""),
  ]);
  const sameAs = [
    settings?.instagram_url,
    settings?.google_maps_url,
  ].filter((u): u is string => Boolean(u));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    name: "Lombok Local",
    description:
      "Local travel partner in Kuta Lombok: private tours, scooter & car rental, airport transfers and local experiences.",
    url: siteUrl(),
    ...(number ? { telephone: `+${number}` } : {}),
    priceRange: "Rp 75000+",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuta",
      addressRegion: "West Nusa Tenggara",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.8956,
      longitude: 116.2792,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "21:00",
    },
    areaServed: ["Kuta Lombok", "South Lombok", "Senggigi", "Mataram", "Lombok"],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
