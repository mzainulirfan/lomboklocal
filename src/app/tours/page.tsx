import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { TourCard } from "@/components/cards";
import { getTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Tours",
  description: "Private tours in Lombok — south beaches, snorkeling, waterfalls and culture.",
};

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>Explore</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Tours made around you.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Private trips with a local driver-guide. Clear pricing, flexible pace, hotel pickup.
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
