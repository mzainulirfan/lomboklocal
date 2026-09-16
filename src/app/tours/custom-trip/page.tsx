import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getWhatsappNumber } from "@/lib/settings";
import { CustomTripPlanner } from "./CustomTripPlanner";

export const metadata: Metadata = {
  title: "Custom Trip Planner",
  description: "Build your own Lombok itinerary by duration, interests and style — then discuss with a local.",
};

export default async function CustomTripPage() {
  const number = await getWhatsappNumber();
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>Custom trip</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Your Lombok trip.
          </h1>
          <CustomTripPlanner number={number} />
        </Container>
      </main>
    </>
  );
}
