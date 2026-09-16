import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { VehicleCard } from "@/components/cards";
import { getVehicles } from "@/lib/vehicles";
import { getWhatsappNumber } from "@/lib/settings";
import { getDict, getLocale } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Car Rental Lombok",
  description:
    "Car rental in Lombok with driver from Rp 650K/day. Fuel, pickup and flexible route included.",
};

export default async function CarPage() {
  const cars = await getVehicles("car");
  const number = await getWhatsappNumber();
  const t = getDict(await getLocale()).car;
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-16">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            {t.desc}
          </p>
        </Container>
        <div className="bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2">
              {cars.map((v) => (
                <VehicleCard key={v.name} vehicle={v} number={number} labels={t} />
              ))}
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}
