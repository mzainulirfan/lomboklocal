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
import { getGalleryImages, getHero } from "@/lib/gallery";
import { waGeneral } from "@/lib/whatsapp";
import { getDict, getLocale } from "@/i18n/dictionaries";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export const metadata: Metadata = {
  title: "Scooter Rental, Private Tours & Airport Transfer in Lombok",
  description:
    "Lombok Local: scooter rental in Kuta from Rp 75K/day, private South Lombok tours, car rental with driver & fixed-price airport transfer. Book via WhatsApp.",
  alternates: { canonical: "/" },
};

const serviceIcons = [Bike, Car, Ship, Van];
const serviceHrefs = ["/rental/scooter", "/rental/car", "/tours", "/transfer"];

export default async function Home() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const t = dict.home;
  const cardLabels = dict.scooter;
  const scooters = (await getVehicles("scooter")).slice(0, 2);
  const featuredTours = (await getTours()).slice(0, 2);
  const hero = await getHero();
  const gallery = await getGalleryImages();
  const number = await getWhatsappNumber();
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — PRD §11 */}
        <section className="relative min-h-[780px] overflow-hidden bg-ink text-white lg:min-h-[860px]">
          <Image
            src={hero.src}
            alt={hero.alt}
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
                {t.eyebrow}
              </p>
              <h1 className="display max-w-4xl text-[clamp(3rem,12vw,10rem)] font-extrabold uppercase">
                {t.titleA}
                <br />
                {t.titleB}
                <br />
                <span className="text-white/55">{t.titleC}</span>
              </h1>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/tours" variant="light">
                  {t.explore} <ArrowUpRight size={16} className="ml-3" />
                </Button>
                <Button href="/rental/scooter" variant="outline-light">
                  {t.rent}
                </Button>
              </div>
            </div>
            <div className="absolute bottom-8 right-5 hidden max-w-xs text-right text-sm leading-6 text-white/70 lg:right-12 lg:block">
              {t.storyA}
              <br />
              <span className="text-white">{t.storyB}</span>
            </div>
          </Container>
        </section>

        {/* QUICK SERVICES */}
        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
            {t.services.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
              <Link
                key={s.title}
                href={serviceHrefs[i]}
                className={`group border-black/10 p-7 transition hover:bg-sand lg:p-10 ${
                  i < 2 ? "border-b lg:border-b-0" : ""
                } ${i % 2 === 0 ? "border-r" : ""} ${i === 1 ? "lg:border-r" : ""} ${
                  i === 2 ? "lg:border-r" : ""
                }`}
              >
                <div className="mb-12 flex items-start justify-between">
                  <Icon size={30} strokeWidth={1.75} />
                  <ArrowUpRight size={20} className="transition group-hover:translate-x-1" />
                </div>
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="mt-2 text-sm text-black/50">{s.desc}</p>
              </Link>
              );
            })}
          </div>
        </section>

        {/* TOURS */}
        <section id="tours" className="bg-sand">
          <Container className="py-24 lg:py-32">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <SectionLabel>{t.toursLabel}</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  {t.toursA}
                  <br />
                  {t.toursB}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-black/55">
                {t.toursDesc}
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
                {t.viewAll} <ArrowUpRight size={16} />
              </Link>
            </div>
          </Container>
        </section>

        {/* RENTAL */}
        <section id="rental" className="bg-ink text-white">
          <Container className="py-24 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <SectionLabel tone="text-white/40">{t.rentalLabel}</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  {t.rentalA}
                  <br />
                  <span className="text-white/40">{t.rentalB}</span>
                </h2>
                <p className="mt-8 max-w-md text-sm leading-7 text-white/55">
                  {t.rentalDesc}
                </p>
                <Button href="/rental/scooter" variant="light" className="mt-9">
                  {t.rentalCta} <ArrowUpRight size={16} className="ml-3" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {scooters.map((v) => (
                  <VehicleCard key={v.name} vehicle={v} number={number} labels={cardLabels} href="/rental/scooter#fleet" />
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
                <SectionLabel tone="text-coral">{t.expLabel}</SectionLabel>
                <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                  {t.expA}
                  <br />
                  {t.expB}
                </h2>
              </div>
              <div>
                <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
                  {t.expDesc}
                </p>
                <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
                  {t.expItems.map((e) => (
                    <Link key={e} href="/experiences" className="group flex items-center justify-between py-6">
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
            <SectionLabel tone="text-black/40">{t.whyLabel}</SectionLabel>
            <div className="grid gap-10 border-t border-black/10 pt-10 md:grid-cols-2 lg:grid-cols-4">
              {t.why.map((f, i) => (
                <div key={f.t}>
                  <span className="text-sm font-bold text-ocean">0{i + 1}</span>
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel tone="text-black/40">{t.reviewsLabel}</SectionLabel>
                <h2 className="display text-5xl font-extrabold uppercase sm:text-7xl">
                  {t.reviewsTitle}
                </h2>
              </div>
              <p className="flex items-center gap-2 text-sm font-bold">
                <span className="tracking-[.2em]">★★★★★</span>
                <span className="text-black/50">{t.reviewsRating}</span>
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {t.reviews.map((r) => (
                <figure key={r.n} className="flex flex-col justify-between rounded-[2rem] bg-sand p-8 transition hover:-translate-y-1">
                  <div>
                    <div className="text-base tracking-[.25em]">★★★★★</div>
                    <blockquote className="mt-5 text-lg font-semibold leading-snug tracking-tight">
                      &ldquo;{r.q}&rdquo;
                    </blockquote>
                  </div>
                  <figcaption className="mt-7 flex items-center gap-3.5 border-t border-black/10 pt-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ocean text-base font-extrabold text-white">
                      {r.n.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">{r.n} · {r.c}</span>
                      <span className="mt-0.5 block text-xs font-bold uppercase tracking-widest text-black/40">{r.s}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>

        {/* GALLERY — PRD §11 */}
        <section className="bg-sand">
          <Container className="pb-24 lg:pb-32">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {gallery.map((g, i) => (
                <div key={`${g.src}-${i}`} className="relative aspect-square overflow-hidden rounded-[1.5rem]">
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
              <SectionLabel tone="text-white/50">{t.ctaLabel}</SectionLabel>
              <h2 className="display text-6xl font-extrabold uppercase sm:text-8xl">
                {t.ctaA}
                <br />
                {t.ctaB}
              </h2>
              <p className="mt-8 max-w-md text-sm leading-7 text-white/65">
                {t.ctaDesc}
              </p>
              <Button href={waGeneral(number)} variant="light" className="mt-10">
                {t.ctaButton} <ArrowUpRight size={16} className="ml-3" />
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <LocalBusinessJsonLd />
    </>
  );
}
