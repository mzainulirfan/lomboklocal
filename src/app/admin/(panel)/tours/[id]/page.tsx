import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { TourRow } from "@/lib/tours";
import { upsertTour, addItinerary, deleteItinerary } from "../../../actions";
import { PanelHeader, EmptyState, input, label } from "../../ui";

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

      <form action={upsertTour} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
        <input type="hidden" name="id" value={t.id} />
        <div>
          <label className={label}>Judul</label>
          <input name="title" required defaultValue={t.title} className={input} />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input name="slug" defaultValue={t.slug} className={input} />
        </div>
        <div>
          <label className={label}>Area</label>
          <input name="area" defaultValue={t.area} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Durasi</label>
            <input name="duration" defaultValue={t.duration} className={input} />
          </div>
          <div>
            <label className={label}>Tipe</label>
            <input name="type" defaultValue={t.type} className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Harga (Rp)</label>
          <input name="price_amount" inputMode="numeric" required defaultValue={t.price_amount} className={input} />
        </div>
        <div>
          <label className={label}>Catatan harga</label>
          <input name="price_note" defaultValue={t.price_note} className={input} />
        </div>
        <div>
          <label className={label}>Ganti foto (kosongkan bila tidak diganti)</label>
          <input name="photo" type="file" accept="image/*" className={input} />
        </div>
        <div>
          <label className={label}>URL foto saat ini</label>
          <input name="image_url" defaultValue={t.image_url} className={input} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Deskripsi singkat</label>
          <textarea name="description" rows={2} defaultValue={t.description} className={input} />
        </div>
        <div>
          <label className={label}>Included (satu per baris)</label>
          <textarea name="included" rows={4} defaultValue={t.included.join("\n")} className={input} />
        </div>
        <div>
          <label className={label}>Not included (satu per baris)</label>
          <textarea name="excluded" rows={4} defaultValue={t.excluded.join("\n")} className={input} />
        </div>
        <div>
          <label className={label}>Urutan</label>
          <input name="sort_order" inputMode="numeric" defaultValue={t.sort_order} className={input} />
        </div>
        <label className="flex items-center gap-3 self-end pb-4 text-sm font-bold">
          <input name="published" type="checkbox" defaultChecked={t.published} className="h-5 w-5" /> Tampilkan di web
        </label>
        <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white md:col-span-2">
          Simpan perubahan
        </button>
      </form>

      <h2 className="mb-3 mt-10 text-sm font-extrabold uppercase tracking-widest text-black/40">
        Itinerary ({stops.length} stop)
      </h2>
      <div className="space-y-2.5">
        {stops.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3.5">
            <p className="text-sm">
              <span className="font-extrabold tabular-nums text-ocean">{s.time}</span>
              <span className="mx-3 text-black/20">·</span>
              <span className="font-bold">{s.place}</span>
            </p>
            <form action={deleteItinerary}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="slug" value={t.slug} />
              <button type="submit" className="rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral">
                Hapus
              </button>
            </form>
          </div>
        ))}
        {stops.length === 0 && <EmptyState>Belum ada stop — tambah di bawah.</EmptyState>}
      </div>

      <form action={addItinerary} className="mt-4 grid grid-cols-[110px_1fr_auto] items-end gap-3 rounded-[2rem] bg-white p-5">
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
        <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white">
          <Plus size={15} /> Tambah
        </button>
      </form>
    </>
  );
}
