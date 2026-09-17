import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getDict, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "About Lombok Local — Your Local Travel Partner in Kuta Lombok",
  description:
    "Lombok Local is a small Kuta-based travel team: private tours, scooter & car rental, airport transfers. Friendly, transparent, flexible.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const t = getDict(await getLocale()).about;
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-9 text-black/60">
            {t.desc}
          </p>
        </Container>
      </main>
    </>
  );
}
