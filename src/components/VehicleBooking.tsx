"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarX2 } from "lucide-react";
import { InquiryButton } from "@/components/InquiryButton";
import { checkDateBlocked } from "@/actions/availability";
import { waScooter } from "@/lib/whatsapp";

/** Pilihan tanggal + durasi + tombol booking per unit kendaraan. */
export function VehicleBooking({
  model,
  vehicleId,
  number,
  labels,
}: {
  model: string;
  vehicleId: string;
  number: string;
  labels: { date: string; days: string; bookUnit: string; opening: string; cancelNote: string; fullNote: string };
}) {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("3");
  const [checked, setChecked] = useState<{ date: string; blocked: boolean } | null>(null);

  useEffect(() => {
    if (!date) return;
    let alive = true;
    checkDateBlocked("vehicle", vehicleId, date).then((b) => {
      if (alive) setChecked({ date, blocked: b });
    });
    return () => {
      alive = false;
    };
  }, [date, vehicleId]);

  const blocked = checked?.date === date && checked.blocked;

  const label = "block text-xs font-bold uppercase tracking-widest text-white/40";
  const field =
    "mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white [color-scheme:dark]";

  return (
    <div className="mt-auto pt-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>{labels.date}</label>
          <input
            type="date"
            aria-label="Rental date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className={label}>{labels.days}</label>
          <input
            type="number"
            aria-label="Rental duration in days"
            min={1}
            max={60}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={field}
          />
        </div>
      </div>
      {blocked && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-coral/15 px-4 py-3 text-xs font-bold leading-5 text-coral">
          <CalendarX2 size={15} className="mt-0.5 shrink-0" /> {labels.fullNote}
        </p>
      )}
      <InquiryButton
        inquiry={{ type: "vehicle", title: model, payload: { date, duration } }}
        fallbackHref={waScooter(model, date, duration, "", number)}
        busyLabel={labels.opening}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-sm font-bold text-ink transition hover:bg-white/90"
      >
        {labels.bookUnit} <ArrowUpRight size={16} className="ml-2" />
      </InquiryButton>
      <p className="mt-2.5 text-center text-xs text-white/35">
        {labels.cancelNote}
      </p>
    </div>
  );
}
