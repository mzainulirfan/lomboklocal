import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { VehicleCard } from "@/components/cards";
import { getVehicles } from "@/lib/vehicles";
import { getWhatsappNumber } from "@/lib/settings";
import { waScooter } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Car Rental Lombok",
  description:
    "Car rental in Lombok with driver from Rp 650K/day. Fuel, pickup and flexible route included.",
};

export default async function CarPage() {
  const cars = await getVehicles("car");
  const number = await getWhatsappNumber();
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-16">
          <SectionLabel>Rental · Car</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Comfort on your route.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Cars with experienced local drivers. Ideal for families, groups and long distances.
          </p>
        </Container>
        <div className="bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2">
              {cars.map((v, i) => (
                <VehicleCard key={v.name} vehicle={v} index={`0${i + 1}`} cta={waScooter(v.name, "", "", "", number)} />
              ))}
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}
