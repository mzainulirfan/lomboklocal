import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Bike,
  CalendarX2,
  Fuel,
  IdCard,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel, Button } from "@/components/ui";
import { VehicleShowcase } from "@/components/VehicleShowcase";
import { getVehicles } from "@/lib/vehicles";
import { getUsdRate, getWhatsappNumber } from "@/lib/settings";
import { formatUSD } from "@/lib/format";
import { waGeneral } from "@/lib/whatsapp";
import { getDict, getLocale } from "@/i18n/dictionaries";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Scooter Rental Kuta Lombok from Rp 75K/Day",
  description:
    "Scooter rental in Kuta Lombok from Rp 75K/day. Honda Scoopy & Vario, 2 helmets + phone holder included, free Kuta delivery. Book via WhatsApp.",
  alternates: { canonical: "/rental/scooter" },
};

const stepIcons = [Bike, MessageCircle, Fuel];
const condIcons = [IdCard, Wallet, CalendarX2, Fuel];

export default async function ScooterPage() {
  const scooters = await getVehicles("scooter");
  const number = await getWhatsappNumber();
  const rate = await getUsdRate();
  const t = getDict(await getLocale()).scooter;
  const fleet = scooters.map((v) => ({ vehicle: v, usd: formatUSD(v.dailyAmount, rate) }));
  const steps = t.steps.map((s, i) => ({ ...s, icon: stepIcons[i] }));
  const conditions = t.conds.map((c, i) => ({ ...c, icon: condIcons[i] }));
  const from = scooters[0]?.daily ?? "Rp 75K";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Scooter rental Kuta Lombok",
    itemListElement: scooters.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${v.name} rental — Kuta Lombok`,
        image: v.image,
        description: v.spec,
        ...(v.dailyAmount
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "IDR",
                price: v.dailyAmount,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      },
    })),
  };

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand">
        {/* Hero */}
        <Container className="pb-14 pt-32">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40">
            <Link href="/" className="hover:text-ink">{t.crumbHome}</Link>
            <span>/</span>
            <Link href="/rental/scooter" className="hover:text-ink">{t.crumbRental}</Link>
            <span>/</span>
            <span className="text-ink">{t.crumbScooter}</span>
          </p>
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-4xl text-5xl font-extrabold uppercase sm:text-7xl lg:text-8xl">
            {t.titleA}
            <br />
            {t.titleB}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-black/60">
            {t.desc}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {[
              `${t.fromPrefix} ${from}/day`,
              ...t.chips,
            ].map((chip) => (
              <span key={chip} className="rounded-full bg-white px-4 py-2 text-sm font-bold">
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#fleet"
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-black"
            >
              {t.viewUnits} <ArrowDown size={16} className="ml-2" />
            </a>
            <Button href={waGeneral(number)} variant="ocean">
              {t.chatWa} <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </Container>

        {/* Fleet */}
        <div id="fleet" className="scroll-mt-8 bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel tone="text-white/40">{t.fleetLabel}</SectionLabel>
                <h2 className="display text-4xl font-extrabold uppercase sm:text-6xl">
                  {t.fleetA}
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/50">
                {t.fleetDesc}
              </p>
            </div>
            <div className="mt-12">
              <Suspense>
                <VehicleShowcase items={fleet} number={number} labels={t} detailsLabel={t.fleetA} />
              </Suspense>
            </div>
          </Container>
        </div>

        {/* How it works */}
        <div className="bg-white">
          <Container className="py-16 lg:py-24">
            <SectionLabel>{t.stepsLabel}</SectionLabel>
            <h2 className="display max-w-2xl text-4xl font-extrabold uppercase sm:text-6xl">
              {t.stepsTitle}
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-[1.75rem] bg-sand p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                      <s.icon size={22} strokeWidth={1.75} />
                    </span>
                    <span className="text-sm font-extrabold text-black/25">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/55">{s.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* Conditions */}
        <Container className="py-16 lg:py-24">
          <SectionLabel tone="text-black/40">{t.condLabel}</SectionLabel>
          <h2 className="display max-w-2xl text-4xl font-extrabold uppercase sm:text-6xl">
            {t.condTitle}
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {conditions.map((c) => (
              <div key={c.title} className="rounded-[1.75rem] bg-white p-7">
                <c.icon size={24} strokeWidth={1.75} className="text-ocean" />
                <h3 className="mt-5 font-extrabold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/55">{c.desc}</p>
              </div>
            ))}
          </div>
        </Container>

        {/* FAQ */}
        <div className="bg-white">
          <Container className="max-w-4xl py-16 lg:py-24">
            <SectionLabel>{t.faqLabel}</SectionLabel>
            <h2 className="display text-4xl font-extrabold uppercase sm:text-6xl">
              {t.faqTitle}
            </h2>
            <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
              {t.faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-bold sm:text-lg [&::-webkit-details-marker]:hidden">
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
        </div>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ocean text-white">
          <Container className="relative py-16 lg:py-24">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <SectionLabel tone="text-white/50">{t.ctaLabel}</SectionLabel>
                <h2 className="display text-5xl font-extrabold uppercase sm:text-7xl">
                  {t.ctaTitle}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                  {t.ctaDesc}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button href={waGeneral(number)} variant="light">
                  {t.ctaButton} <ArrowUpRight size={16} className="ml-2" />
                </Button>
                <Link
                  href="/rental/car"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white/80 hover:text-white"
                >
                  {t.carLink} <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
