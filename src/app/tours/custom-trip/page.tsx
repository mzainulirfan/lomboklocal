import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getWhatsappNumber } from "@/lib/settings";
import { getDict, getLocale } from "@/i18n/dictionaries";
import { CustomTripPlanner } from "./CustomTripPlanner";

export const metadata: Metadata = {
  title: "Custom Trip Planner",
  description: "Build your own Lombok itinerary by duration, interests and style — then discuss with a local.",
};

export default async function CustomTripPage() {
  const number = await getWhatsappNumber();
  const dict = getDict(await getLocale());
  const t = dict.custom;
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <CustomTripPlanner number={number} t={t} phoneLabel={dict.common.phone} phonePh={dict.common.phonePh} />
        </Container>
      </main>
    </>
  );
}
