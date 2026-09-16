"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { submitInquiry } from "@/actions/inquiries";
import { waTransfer } from "@/lib/whatsapp";
import type { TransferRoute } from "@/lib/transfers";

export function TransferForm({ routes, number }: { routes: TransferRoute[]; number: string }) {
  const [to, setTo] = useState(routes[0]?.to ?? "Kuta Lombok");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("2");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    // Buka tab sinkron saat gesture agar tidak diblokir popup blocker,
    // URL diisi setelah lead tersimpan.
    const win = window.open("about:blank", "_blank");
    const go = (url: string) => {
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    };
    try {
      const url = await submitInquiry({
        type: "transfer",
        title: `Airport → ${to}`,
        payload: { from: "Lombok Airport", to, date, pax },
      });
      go(url);
    } catch {
      go(waTransfer("Lombok Airport", to, date, pax, number));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="rounded-[2rem] bg-white p-8" onSubmit={onSubmit}>
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
        {routes.map((r) => (
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
        disabled={busy}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ocean px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Membuka…" : <>Request transfer <ArrowUpRight size={16} className="ml-2" /></>}
      </button>
    </form>
  );
}
