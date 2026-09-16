import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Lombok Local — local travel partner in Lombok. Friendly, transparent, flexible.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>About</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Local team. Human trips.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-9 text-black/60">
            We are a small Lombok-based team. No call centers, no hidden fees — just people who
            know the island and answer you on WhatsApp.
          </p>
        </Container>
      </main>
    </>
  );
}
