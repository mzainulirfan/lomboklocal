import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { VehicleCard } from "@/components/cards";
import { scooters } from "@/content/site";
import { waScooter } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Scooter Rental Kuta Lombok",
  description:
    "Scooter rental in Kuta Lombok from Rp 75K/day. Helmets, phone holder and free delivery. Book via WhatsApp.",
};

export default function ScooterPage() {
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-16">
          <SectionLabel>Rental · Scooter</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Your ride. Your freedom.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Automatic scooters, well maintained. 2 helmets + phone holder included. Delivery in
            Kuta area, pickup available.
          </p>
        </Container>
        <div className="bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {scooters.map((v, i) => (
                <VehicleCard key={v.name} vehicle={v} index={`0${i + 1}`} cta={waScooter(v.name)} />
              ))}
            </div>
            <div className="mt-10 rounded-3xl bg-white/5 p-7 text-sm leading-7 text-white/60">
              <p className="font-bold text-white">Rental conditions</p>
              <p className="mt-2">
                Passport or ID deposit · Pay on pickup · Free cancellation up to 24h before ·
                Fuel policy: return as received.
              </p>
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}
