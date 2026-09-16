import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel, Button } from "@/components/ui";
import { waGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Local Experiences",
  description:
    "Surfing, snorkeling, waterfalls, Sasak culture and local food — experience Lombok with locals.",
};

const items = [
  {
    title: "Surf & Ocean",
    desc: "Beginner breaks in Kuta and Gerupuk with local coaches.",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Snorkeling",
    desc: "Coral gardens, turtles and clear water boat days.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Waterfalls",
    desc: "Jungle walks to Sendang Gile and hidden falls.",
    image:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Sasak Culture",
    desc: "Weaving villages, local markets and traditions.",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Local Food",
    desc: "Ayam taliwang, warungs and night market walks.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Sunset & Fishing",
    desc: "Slow evenings — beach bonfires or boats with fishermen.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel tone="text-coral">Experiences</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Meet Lombok.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-9 text-black/60">
            Experience first, transaction second. Tell us what you love — we match you with a
            local who does it every day.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <a key={e.title} href={waGeneral()} target="_blank" rel="noopener noreferrer" className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-7 text-white">
                    <h2 className="text-2xl font-bold tracking-tight">{e.title}</h2>
                    <p className="mt-2 text-sm text-white/70">{e.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                      Ask a local <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button href={waGeneral()} variant="dark">
              Talk to a local <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
