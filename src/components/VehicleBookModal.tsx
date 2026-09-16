"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import type { Vehicle } from "@/content/site";
import { VehicleBooking } from "@/components/VehicleBooking";
import type { CardLabels } from "@/components/cards";

/**
 * Tombol "Pilih & Booking" + bottom-sheet/modal berisi detail unit
 * dan form booking. Satu komponen dipakai semua kartu.
 */
export function VehicleBookModal({
  vehicle,
  number,
  labels,
  usd,
}: {
  vehicle: Vehicle;
  number: string;
  labels: CardLabels;
  usd: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-sm font-bold text-ink transition hover:bg-white/90"
      >
        {labels.selectUnit} <ArrowUpRight size={16} className="ml-2" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${vehicle.name} booking`}
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-ink text-white ring-1 ring-white/15 sm:rounded-[2rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between gap-3 bg-ink/95 px-6 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight">{vehicle.name}</p>
                <p className="text-sm text-white/50">
                  {vehicle.daily}
                  <span className="font-normal text-white/35">{labels.perDay}</span>
                  {usd && <span className="ml-2 text-white/35">{usd}{labels.perDay}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.closeDetails}
                className="shrink-0 rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-6">
              {vehicle.highlight && (
                <p className="inline-flex items-center rounded-full bg-ocean/20 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
                  {vehicle.highlight}
                </p>
              )}
              <p className="mt-3 text-sm text-white/55">{vehicle.spec}</p>
              <ul className="mt-4 space-y-2">
                {vehicle.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-white/75">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                      <Check size={12} className="text-emerald-300" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              {vehicle.weekly && (
                <p className="mt-4 inline-flex items-center rounded-full bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                  {vehicle.weekly}
                  {labels.perWeek} · {labels.weeklySave}
                </p>
              )}
              <VehicleBooking model={vehicle.name} vehicleId={vehicle.id} number={number} labels={labels} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
