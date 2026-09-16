import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Booking, pricing, rental and transfer questions — answered simply.",
};

const faqs = [
  {
    q: "How do I book?",
    a: "Tap any Book / Rent button — it opens WhatsApp with a pre-filled message. We confirm manually, usually within minutes. No prepayment needed for most services.",
  },
  {
    q: "Are prices fixed?",
    a: "Yes. Tour and transfer prices are fixed per trip, scooter/car per day. Fuel, parking and driver are included where stated. Anything extra is listed under Not included.",
  },
  {
    q: "What do I need to rent a scooter?",
    a: "Passport or ID, and basic riding experience. Helmets and phone holder included. Pay on pickup, free cancellation up to 24h before.",
  },
  {
    q: "Do you pick up from hotel / airport?",
    a: "Yes. Tours include hotel pickup in the area, transfers include flight tracking with driver waiting at arrivals.",
  },
  {
    q: "Can I customize a tour?",
    a: "Yes — use the Custom Trip planner or just tell us your dates and interests on WhatsApp. We'll propose a route.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 24h before. Same-day changes: chat us, we'll do our best.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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
          <SectionLabel>FAQ</SectionLabel>
          <h1 className="display text-5xl font-extrabold uppercase sm:text-7xl">
            Good questions.
          </h1>
          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {faqs.map((f) => (
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
