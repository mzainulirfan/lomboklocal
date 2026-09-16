import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { TourRow } from "@/lib/tours";
import { addItinerary, deleteItinerary } from "../../../actions";
import { PanelHeader, EmptyState, input, label } from "../../ui";
import { TourForm } from "../TourForm";

type Itin = { id: string; time: string; place: string };

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = supabasePublic();
  if (!sb) notFound();
  const { data: tour } = await sb.from("tours").select("*").eq("id", id).single();
  if (!tour) notFound();
  const t = tour as TourRow & { published: boolean; sort_order: number };
  const { data: itin } = await sb
    .from("tour_itinerary")
    .select("id, time, place")
    .eq("tour_id", id)
    .order("sort_order", { ascending: true });
  const stops = (itin ?? []) as Itin[];

  return (
    <>
      <Link href="/admin/tours" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Tours
      </Link>
      <div className="mt-4">
        <PanelHeader kicker="Trips" title={t.title} desc={`Slug: /tours/${t.slug}`} />
      </div>

      <div className="mt-8">
        <TourForm tour={t} />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-extrabold uppercase tracking-widest text-black/40">
        Itinerary ({stops.length} stop)
      </h2>
      <div className="space-y-2.5">
        {stops.map((s, i) => (
          <div key={s.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3.5">
            <p className="flex min-w-0 items-center gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-extrabold text-black/50">
                {i + 1}
              </span>
              <span className="font-extrabold tabular-nums text-ocean">{s.time}</span>
              <span className="truncate font-bold">{s.place}</span>
            </p>
            <form action={deleteItinerary} className="shrink-0">
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="slug" value={t.slug} />
              <button type="submit" className="rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral hover:text-white">
                Hapus
              </button>
            </form>
          </div>
        ))}
        {stops.length === 0 && <EmptyState>Belum ada stop — tambah di bawah.</EmptyState>}
      </div>

      <form action={addItinerary} className="mt-4 grid grid-cols-1 items-end gap-3 rounded-[2rem] bg-white p-5 sm:grid-cols-[110px_1fr_auto]">
        <input type="hidden" name="tour_id" value={t.id} />
        <input type="hidden" name="slug" value={t.slug} />
        <input type="hidden" name="sort_order" value={stops.length + 1} />
        <div>
          <label className={label}>Jam</label>
          <input name="time" required placeholder="09:00" className={input} />
        </div>
        <div>
          <label className={label}>Tempat</label>
          <input name="place" required placeholder="Tanjung Aan" className={input} />
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black">
          <Plus size={15} /> Tambah stop
        </button>
      </form>
    </>
  );
}
