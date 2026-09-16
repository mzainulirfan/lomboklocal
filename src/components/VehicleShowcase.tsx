"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/content/site";
import { VehicleCard, type CardLabels } from "@/components/cards";
import { VehicleBooking } from "@/components/VehicleBooking";
import { cn } from "@/lib/cn";

export type ShowcaseItem = { vehicle: Vehicle; usd: string | null };

/**
 * Showcase adaptif:
 * - Mobile: kartu ringkas → bottom sheet booking (reuse VehicleCard).
 * - Desktop: daftar pilih kiri + panel detail sticky kanan (tanpa popup).
 * Pilihan tersinkron ke ?unit= agar bisa di-share.
 */
export function VehicleShowcase({
  items,
  number,
  labels,
  detailsLabel,
}: {
  items: ShowcaseItem[];
  number: string;
  labels: CardLabels;
  detailsLabel: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("unit");
  const [selectedId, setSelectedId] = useState(
    items.some((i) => i.vehicle.id === initial) ? (initial as string) : (items[0]?.vehicle.id ?? "")
  );
  const selected = useMemo(
    () => items.find((i) => i.vehicle.id === selectedId) ?? items[0],
    [items, selectedId]
  );

  function select(id: string) {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("unit", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  if (!selected) return null;
  const specs = selected.vehicle.spec.split("·").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      {/* Mobile: kartu + bottom sheet */}
      <div className="grid gap-5 sm:grid-cols-2 md:hidden">
        {items.map((item) => (
          <VehicleCard key={item.vehicle.id} vehicle={item.vehicle} number={number} labels={labels} />
        ))}
      </div>

      {/* Desktop: master–detail */}
      <div className="hidden gap-5 md:grid md:grid-cols-[.85fr_1.15fr]">
        <div className="flex flex-col gap-3" role="listbox" aria-label={detailsLabel}>
          {items.map((item) => {
            const v = item.vehicle;
            const active = v.id === selected.vehicle.id;
            return (
              <button
                key={v.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(v.id)}
                className={cn(
                  "group flex items-center gap-4 rounded-[1.5rem] bg-white/5 p-4 text-left ring-1 transition",
                  active ? "ring-2 ring-white/70" : "ring-white/10 hover:ring-white/30"
                )}
              >
                <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    sizes="200px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold tracking-tight">{v.name}</span>
                  {v.highlight && (
                    <span className="mt-1 block truncate text-xs font-bold text-cyan-200/80">
                      {v.highlight}
                    </span>
                  )}
                  <span className="mt-1.5 block text-sm font-bold">
                    {v.daily}
                    <span className="font-medium text-white/45">{labels.perDay}</span>
                    {item.usd && <span className="ml-2 font-normal text-white/35">{item.usd}{labels.perDay}</span>}
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  className={cn("shrink-0 transition", active ? "text-white" : "text-white/30 group-hover:translate-x-0.5 group-hover:text-white/60")}
                />
              </button>
            );
          })}
        </div>

        <aside className="overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10 lg:sticky lg:top-8 lg:self-start">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              key={selected.vehicle.image}
              src={selected.vehicle.image}
              alt={selected.vehicle.name}
              fill
              sizes="(max-width: 1024px) 50vw, 700px"
              className="object-cover"
            />
            <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-extrabold tracking-tight text-ink shadow-lg">
              {selected.vehicle.daily}
              <span className="font-medium text-ink/55">{labels.perDay}</span>
            </span>
          </div>
          <div className="p-7">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-2xl font-extrabold tracking-tight">{selected.vehicle.name}</h3>
              {selected.usd && <p className="text-sm text-white/40">{selected.usd}{labels.perDay}</p>}
            </div>
            {selected.vehicle.highlight && (
              <p className="mt-2.5 w-fit rounded-full bg-ocean/20 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
                {selected.vehicle.highlight}
              </p>
            )}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {specs.map((s) => (
                <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/65">
                  {s}
                </span>
              ))}
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {selected.vehicle.perks.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/75">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                    <Check size={12} className="text-emerald-300" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            {selected.vehicle.weekly && (
              <p className="mt-4 inline-flex items-center rounded-full bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                {selected.vehicle.weekly}
                {labels.perWeek} · {labels.weeklySave}
              </p>
            )}
            <VehicleBooking
              model={selected.vehicle.name}
              vehicleId={selected.vehicle.id}
              number={number}
              labels={labels}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
