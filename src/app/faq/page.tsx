import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getDict, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Lombok Travel FAQ: Booking, Rental Prices & Transfers",
  description:
    "How to book Lombok tours, scooter rental requirements, airport transfer prices & cancellation policy — answered simply.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const t = getDict(await getLocale()).faqPage;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="max-w-4xl pb-24">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {t.items.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="cursor-pointer list-none text-lg font-bold [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-6">
                    {f.q}
                    <span className="text-2xl font-normal transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
