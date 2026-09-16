import { upsertTour } from "../../actions";
import { input, label } from "../ui";

export type TourFormValue = {
  id?: string;
  slug?: string;
  title?: string;
  area?: string;
  duration?: string;
  type?: string;
  price_amount?: number;
  price_note?: string;
  image_url?: string;
  description?: string;
  included?: string[];
  excluded?: string[];
  published?: boolean;
  sort_order?: number;
};

/** Form tambah/edit tour. `tour` kosong = mode tambah. Itinerary diatur terpisah di halaman edit. */
export function TourForm({ tour }: { tour?: TourFormValue | null }) {
  const t = tour ?? null;

  return (
    <form action={upsertTour} className="grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
      {t?.id && <input type="hidden" name="id" value={t.id} />}
      <div>
        <label className={label}>Judul</label>
        <input name="title" required placeholder="The Essential South" defaultValue={t?.title ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Slug (otomatis bila kosong)</label>
        <input name="slug" placeholder="south-lombok" defaultValue={t?.slug ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Area</label>
        <input name="area" placeholder="South Lombok" defaultValue={t?.area ?? ""} className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Durasi</label>
          <input name="duration" defaultValue={t?.duration ?? "1 day"} className={input} />
        </div>
        <div>
          <label className={label}>Tipe</label>
          <input name="type" defaultValue={t?.type ?? "Private"} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Harga (Rp)</label>
        <input name="price_amount" inputMode="numeric" required placeholder="1200000" defaultValue={t?.price_amount ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Catatan harga</label>
        <input name="price_note" placeholder="per trip · up to 4 guests" defaultValue={t?.price_note ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Foto (upload{t ? " — kosongkan bila tidak diganti" : ""})</label>
        <input name="photo" type="file" accept="image/*" className={input} />
      </div>
      <div>
        <label className={label}>atau URL foto</label>
        <input name="image_url" placeholder="https://…" defaultValue={t?.image_url ?? ""} className={input} />
      </div>
      <div className="md:col-span-2">
        <label className={label}>Deskripsi singkat</label>
        <textarea name="description" rows={2} defaultValue={t?.description ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Included (satu per baris)</label>
        <textarea name="included" rows={3} defaultValue={(t?.included ?? []).join("\n")} className={input} />
      </div>
      <div>
        <label className={label}>Not included (satu per baris)</label>
        <textarea name="excluded" rows={3} defaultValue={(t?.excluded ?? []).join("\n")} className={input} />
      </div>
      <div>
        <label className={label}>Urutan tampil</label>
        <input name="sort_order" inputMode="numeric" defaultValue={t?.sort_order ?? 0} className={input} />
      </div>
      <label className="flex items-center gap-3 self-end pb-4 text-sm font-bold">
        <input name="published" type="checkbox" defaultChecked={t?.published ?? true} className="h-5 w-5 accent-ink" /> Tampilkan di web
      </label>
      <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-black md:col-span-2">
        {t ? "Simpan perubahan" : "Simpan tour"}
      </button>
    </form>
  );
}
