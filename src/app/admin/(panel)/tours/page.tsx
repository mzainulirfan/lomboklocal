import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllToursAdmin } from "@/lib/tours";
import { formatRp } from "@/lib/format";
import { upsertTour, deleteTour, toggleTour } from "../../actions";
import { PanelHeader, EmptyState, ViewLink, input, label } from "../ui";

export default async function ToursPage() {
  const configured = isSupabaseConfigured();
  const tours = configured ? await getAllToursAdmin() : [];

  return (
    <>
      <PanelHeader
        kicker="Trips"
        title="Tours."
        desc="Kelola paket tour: harga, deskripsi, include/exclude, dan status tampil. Itinerary diatur di halaman edit."
      />

      {configured && (
        <>
          <form action={upsertTour} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
            <p className="flex items-center gap-2 font-extrabold md:col-span-2">
              <Plus size={17} /> Tambah tour
            </p>
            <div>
              <label className={label}>Judul</label>
              <input name="title" required placeholder="The Essential South" className={input} />
            </div>
            <div>
              <label className={label}>Slug (otomatis bila kosong)</label>
              <input name="slug" placeholder="south-lombok" className={input} />
            </div>
            <div>
              <label className={label}>Area</label>
              <input name="area" placeholder="South Lombok" className={input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Durasi</label>
                <input name="duration" defaultValue="1 day" className={input} />
              </div>
              <div>
                <label className={label}>Tipe</label>
                <input name="type" defaultValue="Private" className={input} />
              </div>
            </div>
            <div>
              <label className={label}>Harga (Rp)</label>
              <input name="price_amount" inputMode="numeric" required placeholder="1200000" className={input} />
            </div>
            <div>
              <label className={label}>Catatan harga</label>
              <input name="price_note" placeholder="per trip · up to 4 guests" className={input} />
            </div>
            <div>
              <label className={label}>Foto (upload)</label>
              <input name="photo" type="file" accept="image/*" className={input} />
            </div>
            <div>
              <label className={label}>atau URL foto</label>
              <input name="image_url" placeholder="https://…" className={input} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Deskripsi singkat</label>
              <textarea name="description" rows={2} className={input} />
            </div>
            <div>
              <label className={label}>Included (satu per baris)</label>
              <textarea name="included" rows={3} className={input} />
            </div>
            <div>
              <label className={label}>Not included (satu per baris)</label>
              <textarea name="excluded" rows={3} className={input} />
            </div>
            <div>
              <label className={label}>Urutan</label>
              <input name="sort_order" inputMode="numeric" defaultValue="0" className={input} />
            </div>
            <label className="flex items-center gap-3 self-end pb-4 text-sm font-bold">
              <input name="published" type="checkbox" defaultChecked className="h-5 w-5" /> Tampilkan di web
            </label>
            <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white md:col-span-2">
              Simpan tour
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {tours.map((t) => (
              <div key={t.id} className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {t.image_url && <img src={t.image_url} alt={t.title} className="h-16 w-24 rounded-2xl object-cover" />}
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                    {t.area} · {t.itinerary.length} stop · {t.published ? "tampil" : "draft"}
                  </p>
                  <p className="font-extrabold">{t.title} · {formatRp(t.price_amount)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={toggleTour}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="published" value={String(t.published)} />
                    <input type="hidden" name="slug" value={t.slug} />
                    <button type="submit" className="rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold">
                      {t.published ? "Draftkan" : "Tampilkan"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/tours/${t.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold"
                  >
                    <Pencil size={14} /> Edit + itinerary
                  </Link>
                  <form action={deleteTour}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="slug" value={t.slug} />
                    <button type="submit" className="rounded-full bg-coral/10 px-4 py-2.5 text-sm font-bold text-coral">
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {tours.length === 0 && <EmptyState>Belum ada tour — run migrasi SQL (seed) atau tambah di atas.</EmptyState>}
          </div>

          <ViewLink href="/tours">halaman tours</ViewLink>
        </>
      )}
    </>
  );
}
