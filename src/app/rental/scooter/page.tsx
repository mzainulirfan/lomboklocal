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
import { VehicleCard } from "@/components/cards";
import { getVehicles } from "@/lib/vehicles";
import { getWhatsappNumber } from "@/lib/settings";
import { waGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Scooter Rental Kuta Lombok",
  description:
    "Scooter rental in Kuta Lombok from Rp 75K/day. Honda Scoopy & Vario, helmets + phone holder included, free delivery. Book via WhatsApp.",
};

const steps = [
  { icon: Bike, title: "Pick your scooter", desc: "Automatic, well maintained, full tank to start." },
  { icon: MessageCircle, title: "Chat on WhatsApp", desc: "Tell us date + pickup. Confirmed in minutes." },
  { icon: Fuel, title: "Ride Lombok", desc: "Delivered to you. Return as received." },
];

const conditions = [
  { icon: IdCard, title: "ID deposit", desc: "Passport or ID held during rental." },
  { icon: Wallet, title: "Pay on pickup", desc: "Cash or transfer. No prepayment." },
  { icon: CalendarX2, title: "Free cancellation", desc: "Cancel free up to 24h before." },
  { icon: Fuel, title: "Full-to-full", desc: "Return fuel as received." },
];

const faqs = [
  {
    q: "Do I need a license?",
    a: "An international driving permit (motorcycle) is officially required. Most guests ride with a home license + experience — ride careful, police checks happen near town.",
  },
  {
    q: "Are helmets included?",
    a: "Yes — 2 helmets plus a phone holder with every scooter, at no extra cost.",
  },
  {
    q: "Do you deliver?",
    a: "Free delivery in the Kuta area. Elsewhere in South Lombok on request — just ask on WhatsApp.",
  },
  {
    q: "What if the scooter breaks down?",
    a: "Message us and we arrange a swap or pickup. You are never stranded — that's the local advantage.",
  },
];

export default async function ScooterPage() {
  const scooters = await getVehicles("scooter");
  const number = await getWhatsappNumber();
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
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link href="/rental/scooter" className="hover:text-ink">Rental</Link>
            <span>/</span>
            <span className="text-ink">Scooter</span>
          </p>
          <SectionLabel>Rental · Scooter · Kuta Lombok</SectionLabel>
          <h1 className="display max-w-4xl text-5xl font-extrabold uppercase sm:text-7xl lg:text-8xl">
            Your ride.
            <br />
            Your freedom.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-black/60">
            Automatic scooters, well maintained, ready to explore South Lombok.
            Helmets + phone holder included, delivered to you in Kuta.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {[
              `From ${from}/day`,
              "Free Kuta delivery",
              "Book in 1 chat",
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
              Lihat unit <ArrowDown size={16} className="ml-2" />
            </a>
            <Button href={waGeneral(number)} variant="ocean">
              Chat WhatsApp <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </Container>

        {/* Fleet */}
        <div id="fleet" className="scroll-mt-8 bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel tone="text-white/40">The fleet</SectionLabel>
                <h2 className="display text-4xl font-extrabold uppercase sm:text-6xl">
                  Pick your ride.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/50">
                Semua unit automatic, servis rutin, bensin penuh saat serah terima.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {scooters.map((v, i) => (
                <VehicleCard key={v.name} vehicle={v} index={`0${i + 1}`} number={number} />
              ))}
            </div>
          </Container>
        </div>

        {/* How it works */}
        <div className="bg-white">
          <Container className="py-16 lg:py-24">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="display max-w-2xl text-4xl font-extrabold uppercase sm:text-6xl">
              On the road in 3 steps.
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
          <SectionLabel tone="text-black/40">Good to know</SectionLabel>
          <h2 className="display max-w-2xl text-4xl font-extrabold uppercase sm:text-6xl">
            Simple conditions.
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
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="display text-4xl font-extrabold uppercase sm:text-6xl">
              Asked often.
            </h2>
            <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
              {faqs.map((f) => (
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
                <SectionLabel tone="text-white/50">Ready when you are</SectionLabel>
                <h2 className="display text-5xl font-extrabold uppercase sm:text-7xl">
                  Ready to ride?
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                  Tell us your dates — we confirm availability and delivery in minutes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button href={waGeneral(number)} variant="light">
                  Rent via WhatsApp <ArrowUpRight size={16} className="ml-2" />
                </Button>
                <Link
                  href="/rental/car"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white/80 hover:text-white"
                >
                  Need a car instead? <ArrowUpRight size={15} />
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
