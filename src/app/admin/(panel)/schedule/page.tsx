import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllVehiclesAdmin } from "@/lib/vehicles";
import { getAllToursAdmin } from "@/lib/tours";
import { getBlocksInRange, getUpcomingBlocks } from "@/lib/availability";
import { blockDate, unblockDate } from "../../actions";
import { PanelHeader, EmptyState } from "../ui";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const days = new Date(y, m, 0).getDate();
  // Offset Senin-pertama: Min=0 ... Aha=6
  const offset = (first.getDay() + 6) % 7;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    y, m, days, offset,
    from: `${y}-${pad(m)}-01`,
    to: `${y}-${pad(m)}-${days}`,
    iso: (d: number) => `${y}-${pad(m)}-${pad(d)}`,
  };
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string; month?: string }>;
}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const vehicles = configured ? await getAllVehiclesAdmin() : [];
  const tours = configured ? await getAllToursAdmin() : [];
  const options = [
    ...vehicles.map((v) => ({ key: `vehicle:${v.id}`, label: `🚗 ${v.name}` })),
    ...tours.map((t) => ({ key: `tour:${t.id}`, label: `🗺️ ${t.title}` })),
  ];
  const item = options.some((o) => o.key === params.item) ? (params.item as string) : (options[0]?.key ?? "");
  const [itemType, itemId] = item.split(":");
  const now = new Date();
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? (params.month as string) : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const cal = monthRange(month);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const blocks = item && configured
    ? await getBlocksInRange(itemType as "vehicle" | "tour", itemId, cal.from, cal.to)
    : [];
  const byDate = new Map(blocks.map((b) => [b.date, b]));
  const upcoming = configured ? await getUpcomingBlocks(15) : [];
  const names = new Map<string, string>([
    ...vehicles.map((v) => [`vehicle:${v.id}`, v.name] as const),
    ...tours.map((t) => [`tour:${t.id}`, t.title] as const),
  ]);

  const withItem = (extra: string) => `/admin/schedule?item=${encodeURIComponent(item)}${extra}`;

  return (
    <>
      <PanelHeader
        kicker="Ketersediaan"
        title="Jadwal."
        desc="Tandai tanggal penuh per unit/tour. Tanggal yang diblokir memunculkan peringatan di form booking — overbook kehindari, lead tetap masuk."
      />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
        </div>
      )}

      {configured && options.length === 0 && (
        <div className="mt-8"><EmptyState>Belum ada kendaraan/tour — tambah dulu di menu Vehicles/Tours.</EmptyState></div>
      )}

      {configured && options.length > 0 && (
        <>
          <form method="get" action="/admin/schedule" className="mt-8 flex flex-col gap-3 rounded-[2rem] bg-white p-5 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="item" className="text-xs font-bold uppercase tracking-widest text-black/40">Unit / Tour</label>
              <select id="item" name="item" defaultValue={item} className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-bold">
                {options.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
            <input type="hidden" name="month" value={month} />
            <button type="submit" className="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white">
              Tampilkan
            </button>
          </form>

          <div className="mt-6 rounded-[2rem] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <Link
                href={withItem(`&month=${shiftMonth(month, -1)}`)}
                aria-label="Bulan sebelumnya"
                className="rounded-full border border-black/15 p-2.5 transition hover:border-ink"
              >
                <ChevronLeft size={18} />
              </Link>
              <p className="font-extrabold tracking-tight">
                {MONTHS[cal.m - 1]} {cal.y}
              </p>
              <Link
                href={withItem(`&month=${shiftMonth(month, 1)}`)}
                aria-label="Bulan berikutnya"
                className="rounded-full border border-black/15 p-2.5 transition hover:border-ink"
              >
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-extrabold uppercase tracking-widest text-black/40">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                <span key={d} className="py-1">{d}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1.5">
              {Array.from({ length: cal.offset }).map((_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {Array.from({ length: cal.days }).map((_, i) => {
                const day = i + 1;
                const iso = cal.iso(day);
                const past = iso < today;
                const block = byDate.get(iso);
                if (past) {
                  return (
                    <span key={iso} className={cn("rounded-2xl py-2.5 text-sm text-black/25", iso === today && "font-extrabold")}>
                      {day}
                    </span>
                  );
                }
                return (
                  <form key={iso} action={block ? unblockDate : blockDate} className="contents">
                    <input type="hidden" name="item" value={item} />
                    <input type="hidden" name="date" value={iso} />
                    {block && <input type="hidden" name="id" value={block.id} />}
                    <button
                      type="submit"
                      title={block ? `${iso}: penuh — klik untuk buka` : `${iso}: kosong — klik untuk blokir`}
                      aria-label={block ? `Buka blokir ${iso}` : `Blokir ${iso}`}
                      className={cn(
                        "rounded-2xl py-2.5 text-sm font-bold transition",
                        block
                          ? "bg-coral text-white hover:bg-coral/80"
                          : "bg-sand hover:bg-ink hover:text-white",
                        iso === today && !block && "ring-2 ring-ocean"
                      )}
                    >
                      {day}
                    </button>
                  </form>
                );
              })}
            </div>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-black/50">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-coral" /> Penuh (klik = buka)</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sand ring-1 ring-black/10" /> Kosong (klik = blokir)</span>
            </p>
          </div>

          <h2 className="mb-3 mt-10 text-sm font-extrabold uppercase tracking-widest text-black/40">
            Blokir mendatang ({upcoming.length})
          </h2>
          {upcoming.length === 0 && <EmptyState>Tidak ada tanggal diblokir. Klik tanggal di kalender untuk memblokir.</EmptyState>}
          <div className="space-y-2.5">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm">
                <p>
                  <span className="font-extrabold tabular-nums">{b.date}</span>
                  <span className="mx-2 text-black/20">·</span>
                  <span className="font-bold">{names.get(`${b.item_type}:${b.item_id}`) ?? `${b.item_type}`}</span>
                </p>
                <form action={unblockDate}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className="rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral hover:text-white">
                    Buka
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
