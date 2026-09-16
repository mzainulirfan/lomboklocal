import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getTransferRoutes } from "@/lib/transfers";
import { getWhatsappNumber } from "@/lib/settings";
import { TransferForm } from "./TransferForm";

export const metadata: Metadata = {
  title: "Airport Transfer Lombok",
  description:
    "Fixed-price airport transfer in Lombok. Flight tracking, driver waiting at arrivals. Book via WhatsApp.",
};

export default async function TransferPage() {
  const routes = await getTransferRoutes();
  const number = await getWhatsappNumber();

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>Transfer</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Airport pickup, zero stress.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Fixed prices, flight tracking, driver waiting at arrivals with your name.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <TransferForm routes={routes} number={number} />

            <div className="divide-y divide-black/10 rounded-[2rem] bg-white px-8">
              {routes.map((r) => (
                <div key={r.to} className="flex items-center justify-between py-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-black/40">{r.from}</p>
                    <p className="mt-1 text-xl font-bold">{r.to}</p>
                  </div>
                  <p className="font-extrabold">{r.price}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
