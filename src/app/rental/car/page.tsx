import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { VehicleShowcase } from "@/components/VehicleShowcase";
import { getVehicles } from "@/lib/vehicles";
import { getUsdRate, getWhatsappNumber } from "@/lib/settings";
import { formatUSD } from "@/lib/format";
import { getDict, getLocale } from "@/i18n/dictionaries";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Car Rental Lombok with Driver from Rp 650K/Day",
  description:
    "Car rental in Lombok with experienced local driver from Rp 650K/day. Fuel, hotel pickup & flexible route included. Ideal for families. Book via WhatsApp.",
  alternates: { canonical: "/rental/car" },
};

export default async function CarPage() {
  const cars = await getVehicles("car");
  const number = await getWhatsappNumber();
  const rate = await getUsdRate();
  const t = getDict(await getLocale()).car;
  const fleet = cars.map((v) => ({ vehicle: v, usd: formatUSD(v.dailyAmount, rate) }));
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
        <div id="fleet" className="scroll-mt-8 bg-ink py-16 text-white lg:py-24">
          <Container>
            <div className="mt-12">
              <Suspense>
                <VehicleShowcase items={fleet} number={number} labels={t} detailsLabel={t.label} />
              </Suspense>
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}
