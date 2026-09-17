import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { TourCard } from "@/components/cards";
import { getTours } from "@/lib/tours";
import { getDict, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Private Lombok Tours: South Beaches, Snorkeling & Culture",
  description:
    "Private Lombok tours with local driver-guide: South Lombok beaches, snorkeling boat trips & waterfalls. Clear pricing from Rp 850K. Book via WhatsApp.",
  alternates: { canonical: "/tours" },
};

export default async function ToursPage() {
  const tours = await getTours();
  const t = getDict(await getLocale()).toursPage;
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            {t.desc}
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((t, i) => (
              <TourCard key={t.slug} tour={t} wide={i === 0} />
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
