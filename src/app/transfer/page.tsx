"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { transferRoutes } from "@/content/site";
import { waTransfer } from "@/lib/whatsapp";

export default function TransferPage() {
  const [to, setTo] = useState("Kuta Lombok");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("2");

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
            {/* Simple booking interface — PRD §16 */}
            <form
              className="rounded-[2rem] bg-white p-8"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(waTransfer("Lombok Airport", to, date, pax), "_blank");
              }}
            >
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">
                From
              </label>
              <p className="mt-2 rounded-2xl bg-sand px-4 py-3.5 font-bold">Lombok Airport</p>

              <label htmlFor="to" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
                To
              </label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 font-bold"
              >
                {transferRoutes.map((r) => (
                  <option key={r.to} value={r.to}>
                    {r.to} · {r.price}
                  </option>
                ))}
              </select>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-widest text-black/40">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3.5"
                  />
                </div>
                <div>
                  <label htmlFor="pax" className="block text-xs font-bold uppercase tracking-widest text-black/40">
                    Passengers
                  </label>
                  <input
                    id="pax"
                    type="number"
                    min={1}
                    max={12}
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ocean px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Request transfer <ArrowUpRight size={16} className="ml-2" />
              </button>
            </form>

            <div className="divide-y divide-black/10 rounded-[2rem] bg-white px-8">
              {transferRoutes.map((r) => (
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
