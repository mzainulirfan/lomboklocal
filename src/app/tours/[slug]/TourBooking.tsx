"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarX2 } from "lucide-react";
import { InquiryButton } from "@/components/InquiryButton";
import { checkDateBlocked } from "@/actions/availability";
import { waTour } from "@/lib/whatsapp";

/** Form tanggal + tamu di booking card tour. Tanpa reload, langsung ke WhatsApp. */
export function TourBooking({
  tourId,
  tourTitle,
  number,
  labels,
}: {
  tourId: string;
  tourTitle: string;
  number: string;
  labels: { date: string; guests: string; phone: string; phonePh: string; book: string; opening: string; fullNote: string; refCode: string; refHint: string };
}) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [checked, setChecked] = useState<{ date: string; blocked: boolean } | null>(null);

  useEffect(() => {
    if (!date) return;
    let alive = true;
    checkDateBlocked("tour", tourId, date).then((b) => {
      if (alive) setChecked({ date, blocked: b });
    });
    return () => {
      alive = false;
    };
  }, [date, tourId]);

  const blocked = checked?.date === date && checked.blocked;

  const label = "block text-xs font-bold uppercase tracking-widest text-white/40";
  const field =
    "mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white [color-scheme:dark]";

  return (
    <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tour-date" className={label}>{labels.date}</label>
          <input
            id="tour-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="tour-guests" className={label}>{labels.guests}</label>
          <input
            id="tour-guests"
            type="number"
            min={1}
            max={30}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="tour-phone" className={label}>{labels.phone}</label>
        <input
          id="tour-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={labels.phonePh}
          className={field}
        />
      </div>
      {blocked && (
        <p className="flex items-start gap-2 rounded-2xl bg-coral/15 px-4 py-3 text-xs font-bold leading-5 text-coral">
          <CalendarX2 size={15} className="mt-0.5 shrink-0" /> {labels.fullNote}
        </p>
      )}
      <InquiryButton
        inquiry={{ type: "tour", title: tourTitle, phone, payload: { date, guests } }}
        fallbackHref={waTour(tourTitle, date, guests, number)}
        busyLabel={labels.opening}
        onDone={setRef}
        className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition hover:-translate-y-0.5"
      >
        {labels.book} <ArrowUpRight size={16} className="ml-2" />
      </InquiryButton>
      {ref && (
        <p role="status" className="rounded-2xl bg-white/10 px-4 py-3 text-xs leading-5">
          <span className="font-extrabold">{labels.refCode}: {ref}</span>
          <span className="block font-normal text-white/55">{labels.refHint}</span>
        </p>
      )}
    </div>
  );
}
