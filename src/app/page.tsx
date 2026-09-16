import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bike, Car, Ship, Van } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel, Button } from "@/components/ui";
import { TourCard, VehicleCard } from "@/components/cards";
import { getTours } from "@/lib/tours";
import { getVehicles } from "@/lib/vehicles";
import { getWhatsappNumber } from "@/lib/settings";
import { waGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Lombok Local — Explore Lombok Your Way",
  description:
    "Tours, scooter rental, car rental and local experiences in Lombok. Transparent pricing, local team, book via WhatsApp.",
};

const services = [
  { icon: Bike, title: "Scooter Rental", desc: "Freedom to explore.", href: "/rental/scooter" },
  { icon: Car, title: "Car Rental", desc: "Comfort on your route.", href: "/rental/car" },
  { icon: Ship, title: "Private Tours", desc: "Made around you.", href: "/tours" },
  { icon: Van, title: "Airport Transfer", desc: "Start easy. Arrive relaxed.", href: "/transfer" },
];

const experiences = ["Surf & Ocean", "Sasak Culture", "Waterfall Adventure", "Local Food"];

export default async function Home() {
  const scooters = (await getVehicles("scooter")).slice(0, 2);
  const featuredTours = (await getTours()).slice(0, 2);
  const number = await getWhatsappNumber();
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — PRD §11 */}
        <section className="relative min-h-[780px] overflow-hidden bg-ink text-white lg:min-h-[860px]">
          <Image
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=85"
            alt="Tropical coastline in Lombok, Indonesia"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
          <div className="grain absolute inset-0" />
          <Container className="relative flex min-h-[780px] items-end pb-16 pt-32 lg:min-h-[860px] lg:pb-24">
            <div className="max-w-5xl">
              <p className="mb-7 text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                Local travel • Lombok, Indonesia
              </p>
              <h1 className="display max-w-4xl text-[clamp(4.5rem,11vw,10rem)] font-extrabold uppercase">
                Discover
                <br />
                Lombok.
                <br />
                <span className="text-white/55">Your way.</span>
              </h1>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/tours" variant="light">
                  Explore Lombok <ArrowUpRight size={16} className="ml-3" />
                </Button>
                <Button href="/rental/scooter" variant="outline-light">
                  Rent a Scooter
                </Button>
              </div>
            </div>
            <div className="absolute bottom-8 right-5 hidden max-w-xs text-right text-sm leading-6 text-white/70 lg:right-12 lg:block">
              Not just a trip.
              <br />
              <span className="text-white">It&apos;s your Lombok story.</span>
            </div>
          </Container>
        </section>

        {/* QUICK SERVICES */}
        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className={`group border-black/10 p-7 transition hover:bg-sand lg:p-10 ${
                  i < 2 ? "border-b lg:border-b-0" : ""
                } ${i % 2 === 0 ? "border-r" : ""} ${i === 1 ? "lg:border-r" : ""} ${
                  i === 2 ? "lg:border-r" : ""
                }`}
              >
                <div className="mb-12 flex items-start justify-between">
                  <s.icon size={30} strokeWidth={1.75} />
                  <ArrowUpRight size={20} className="transition group-hover:translate-x-1" />
                </div>
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="mt-2 text-sm text-black/50">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* TOURS */}
        <section id="tours" className="bg-sand">
          <Container className="py-24 lg:py-32">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <SectionLabel>01 / Explore</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  Go where
                  <br />
                  you feel.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-black/55">
                From hidden beaches to mountain villages. Choose a route, or let us build one
                around your pace.
              </p>
            </div>
            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredTours[0] && <TourCard tour={featuredTours[0]} wide />}
              {featuredTours[1] && <TourCard tour={featuredTours[1]} />}
            </div>
            <div className="mt-10">
              <Link
                href="/tours"
                className="inline-flex items-center gap-3 border-b border-ink pb-2 text-sm font-bold"
              >
                View all tours <ArrowUpRight size={16} />
              </Link>
            </div>
          </Container>
        </section>

        {/* RENTAL */}
        <section id="rental" className="bg-ink text-white">
          <Container className="py-24 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <SectionLabel tone="text-white/40">02 / Rental</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  Your ride.
                  <br />
                  <span className="text-white/40">Your freedom.</span>
                </h2>
                <p className="mt-8 max-w-md text-sm leading-7 text-white/55">
                  Pick up in Kuta or have your ride delivered. Helmets, phone holder and local
                  support included.
                </p>
                <Button href="/rental/scooter" variant="light" className="mt-9">
                  Check availability <ArrowUpRight size={16} className="ml-3" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {scooters.map((v, i) => (
                  <VehicleCard key={v.name} vehicle={v} index={`0${i + 1}`} number={number} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* EXPERIENCES */}
        <section id="experiences" className="bg-white">
          <Container className="py-24 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <SectionLabel tone="text-coral">03 / Local</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  Meet
                  <br />
                  Lombok.
                </h2>
              </div>
              <div>
                <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
                  Go beyond the postcard. Eat with locals, chase waterfalls, learn to surf, or
                  simply find a beach with nobody around.
                </p>
                <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
                  {experiences.map((e) => (
                    <Link key={e} href="/transfer" className="group flex items-center justify-between py-6">
                      <span className="text-xl font-bold">{e}</span>
                      <ArrowUpRight size={20} className="transition group-hover:translate-x-2" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* WHY US */}
        <section id="about" className="bg-sand">
          <Container className="py-24 lg:py-32">
            <SectionLabel tone="text-black/40">04 / Why us</SectionLabel>
            <div className="grid gap-10 border-t border-black/10 pt-10 md:grid-cols-2 lg:grid-cols-4">
              {[
                { n: "01", t: "Local Team", d: "People who know the island beyond the tourist map." },
                { n: "02", t: "Easy Booking", d: "Ask a question or book directly through WhatsApp." },
                { n: "03", t: "Clear Pricing", d: "Know what you're paying for before the trip begins." },
                { n: "04", t: "Flexible Trips", d: "Your itinerary can move at your pace." },
              ].map((f) => (
                <div key={f.n}>
                  <span className="text-sm font-bold text-ocean">{f.n}</span>
                  <h3 className="mt-8 text-xl font-bold">{f.t}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/50">{f.d}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* REVIEWS */}
        <section className="bg-white">
          <Container className="py-24 lg:py-32">
            <SectionLabel tone="text-black/40">04b / Reviews</SectionLabel>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { q: "Everything was easy from airport pickup until our last day. It felt like having a local friend in Lombok.", n: "Sarah · Australia" },
                { q: "Scooter delivered to our hotel in Kuta, helmets included. Rode south for 5 days, zero issues.", n: "Daan · Netherlands" },
                { q: "Custom 3-day trip: beaches, waterfall, snorkeling. Flexible pace, clear price upfront.", n: "Aina · Malaysia" },
              ].map((r) => (
                <figure key={r.n} className="flex flex-col justify-between rounded-[2rem] bg-sand p-8">
                  <div>
                    <div className="text-lg tracking-[.25em]">★★★★★</div>
                    <blockquote className="mt-5 text-lg font-semibold leading-snug tracking-tight">
                      &ldquo;{r.q}&rdquo;
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 text-sm text-black/50">{r.n}</figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>

        {/* GALLERY — PRD §11 */}
        <section className="bg-sand">
          <Container className="pb-24 lg:pb-32">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", alt: "Lombok coastline" },
                { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Turquoise beach" },
                { src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80", alt: "Surfing in Lombok" },
                { src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80", alt: "Waterfall in Lombok" },
              ].map((g) => (
                <div key={g.src} className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section id="book" className="relative overflow-hidden bg-ocean text-white">
          <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-5 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <Container className="relative py-24 lg:py-32">
            <div className="max-w-4xl">
              <SectionLabel tone="text-white/50">05 / Let&apos;s go</SectionLabel>
              <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                Ready to
                <br />
                explore?
              </h2>
              <p className="mt-8 max-w-md text-sm leading-7 text-white/65">
                Tell us what you&apos;re looking for. We&apos;ll help you build a Lombok trip that
                makes sense for you.
              </p>
              <Button href={waGeneral(number)} variant="light" className="mt-10">
                Talk to a local <ArrowUpRight size={16} className="ml-3" />
              </Button>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
