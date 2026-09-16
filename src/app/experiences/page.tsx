import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel, Button } from "@/components/ui";
import { getWhatsappNumber } from "@/lib/settings";
import { waGeneral } from "@/lib/whatsapp";
import { getDict, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Local Experiences",
  description:
    "Surfing, snorkeling, waterfalls, Sasak culture and local food — experience Lombok with locals.",
};

const images = [
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
];

export default async function ExperiencesPage() {
  const number = await getWhatsappNumber();
  const t = getDict(await getLocale()).experiencesPage;
  const items = t.items.map((e, i) => ({ ...e, image: images[i] }));
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel tone="text-coral">{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-9 text-black/60">
            {t.desc}
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <a key={e.title} href={waGeneral(number)} target="_blank" rel="noopener noreferrer" className="group">
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
                      {t.askLocal} <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button href={waGeneral(number)} variant="dark">
              {t.cta} <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
