import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getTransferRoutes } from "@/lib/transfers";
import { getUsdRate, getWhatsappNumber } from "@/lib/settings";
import { formatUSD } from "@/lib/format";
import { getDict, getLocale } from "@/i18n/dictionaries";
import { TransferForm } from "./TransferForm";

export const metadata: Metadata = {
  title: "Airport Transfer Lombok",
  description:
    "Fixed-price airport transfer in Lombok. Flight tracking, driver waiting at arrivals. Book via WhatsApp.",
};

export default async function TransferPage() {
  const routes = await getTransferRoutes();
  const number = await getWhatsappNumber();
  const rate = await getUsdRate();
  const t = getDict(await getLocale()).transfer;

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>{t.label}</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            {t.desc}
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <TransferForm routes={routes} number={number} labels={t} />

            <div className="divide-y divide-black/10 rounded-[2rem] bg-white px-8">
              {routes.map((r) => (
                <div key={r.to} className="flex items-center justify-between py-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-black/40">{r.from}</p>
                    <p className="mt-1 text-xl font-bold">{r.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold">{r.price}</p>
                    {r.amount != null && (
                      <p className="text-xs font-normal text-black/40">{formatUSD(r.amount, rate)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
