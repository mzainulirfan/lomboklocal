import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, MapPin, X } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container } from "@/components/ui";
import { TourBooking } from "./TourBooking";
import { TourCard } from "@/components/cards";
import { tours as fallbackTours } from "@/content/site";
import { getTourBySlug, getTours } from "@/lib/tours";
import { getUsdRate, getWhatsappNumber } from "@/lib/settings";
import { formatUSD } from "@/lib/format";
import { getDict, getLocale } from "@/i18n/dictionaries";

export async function generateStaticParams() {
  return fallbackTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour not found" };
  const title = `${tour.title} — ${tour.area} Private Tour Lombok`;
  return {
    title,
    description: `${tour.description} ${tour.duration} · ${tour.type}. From ${tour.price} ${tour.priceNote}. Book via WhatsApp.`,
    alternates: { canonical: `/tours/${slug}` },
    openGraph: { title, description: tour.description, images: [tour.image] },
  };
}

export default async function TourDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();
  const number = await getWhatsappNumber();
  const usd = formatUSD(tour.priceAmount, await getUsdRate());
  const localeDict = getDict(await getLocale());
  const t = localeDict.tourDetail;  const others = (await getTours()).filter((t) => t.slug !== slug).slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main className="bg-sand">
        {/* Hero — PRD §13 */}
        <section className="relative min-h-[70vh] overflow-hidden bg-ink text-white">
          <Image src={tour.image} alt={tour.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
          <Container className="relative flex min-h-[70vh] flex-col justify-end pb-14 pt-32">
            <Link href="/tours" className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> {t.allTours}
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
              {tour.area} · {tour.duration} · {tour.type}
            </p>
            <h1 className="display mt-4 max-w-4xl text-5xl font-extrabold uppercase sm:text-8xl">
              {tour.title}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70">{tour.description}</p>
          </Container>
        </section>

        <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_.8fr] lg:py-24">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">{t.itinerary}</h2>
            <ol className="mt-8 space-y-0 border-l border-black/10">
              {tour.itinerary.map((s) => (
                <li key={s.time} className="relative pb-8 pl-8">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ocean" />
                  <p className="text-xs font-bold tabular-nums text-ocean">{s.time}</p>
                  <p className="mt-1 font-bold">{s.place}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-7">
                <h3 className="font-bold">{t.included}</h3>
                <ul className="mt-4 space-y-2.5">
                  {tour.included.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-black/65">
                      <Check size={15} className="mt-0.5 shrink-0 text-ocean" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <h3 className="font-bold">{t.notIncluded}</h3>
                <ul className="mt-4 space-y-2.5">
                  {tour.excluded.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-black/65">
                      <X size={15} className="mt-0.5 shrink-0 text-coral" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking card — sticky CTA per PRD */}
          <aside>
            <div className="rounded-[2rem] bg-ink p-8 text-white lg:sticky lg:top-8">
              <p className="text-xs uppercase tracking-widest text-white/50">{t.from}</p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">
                {tour.price}
                {usd && <span className="ml-3 align-middle text-lg font-bold text-white/40">{usd}</span>}
              </p>
              <p className="mt-1 text-sm text-white/50">{tour.priceNote}</p>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-white/65">
                <p className="flex items-center gap-2">
                  <Clock size={15} /> {tour.duration} · {t.flexible}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={15} /> {t.pickup}
                </p>
              </div>
              <TourBooking tourId={tour.id} tourTitle={tour.title} number={number} labels={{ date: t.date, guests: t.guests, phone: localeDict.common.phone, phonePh: localeDict.common.phonePh, book: t.book, opening: t.opening, fullNote: t.fullNote, refCode: localeDict.common.refCode, refHint: localeDict.common.refHint }} />
              <p className="mt-4 text-center text-xs leading-5 text-white/40">
                {t.note}
              </p>
            </div>
          </aside>
        </Container>

        {others.length > 0 && (
          <Container className="pb-24">
            <h2 className="text-2xl font-extrabold tracking-tight">{t.related}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {others.map((t) => (
                <TourCard key={t.slug} tour={t} />
              ))}
            </div>
          </Container>
        )}
      </main>
    </>
  );
}
