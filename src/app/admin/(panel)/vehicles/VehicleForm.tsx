import { upsertVehicle } from "../../actions";
import { input, label } from "../ui";
import type { VehicleRow } from "@/lib/vehicles";

/** Form tambah/edit kendaraan. `vehicle` kosong = mode tambah. */
export function VehicleForm({ vehicle }: { vehicle?: VehicleRow | null }) {
  const v = vehicle ?? null;

  return (
    <form action={upsertVehicle} className="grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
      {v && <input type="hidden" name="id" value={v.id} />}
      <div>
        <label className={label}>Kategori</label>
        <select name="category" className={input} defaultValue={v?.category ?? "scooter"}>
          <option value="scooter">Scooter</option>
          <option value="car">Car</option>
        </select>
      </div>
      <div>
        <label className={label}>Nama</label>
        <input name="name" required placeholder="Honda Scoopy" defaultValue={v?.name ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Spec</label>
        <input name="spec" placeholder="Automatic · 2 persons" defaultValue={v?.spec ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Harga harian (Rp)</label>
        <input name="daily_price" inputMode="numeric" required placeholder="75000" defaultValue={v?.daily_price ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Harga mingguan (opsional)</label>
        <input name="weekly_price" inputMode="numeric" placeholder="450000" defaultValue={v?.weekly_price ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Urutan tampil</label>
        <input name="sort_order" inputMode="numeric" defaultValue={v?.sort_order ?? 0} className={input} />
      </div>
      <div>
        <label className={label}>Foto (upload, maks 5MB{v ? " — kosongkan bila tidak diganti" : ""})</label>
        <input name="photo" type="file" accept="image/*" className={input} />
      </div>
      <div>
        <label className={label}>atau URL foto</label>
        <input name="image_url" placeholder="https://…" defaultValue={v?.image_url ?? ""} className={input} />
      </div>
      <div className="md:col-span-2">
        <label className={label}>Perks (satu per baris)</label>
        <textarea name="perks" rows={3} placeholder={"2 helmets\nPhone holder"} defaultValue={(v?.perks ?? []).join("\n")} className={input} />
      </div>
      <label className="flex items-center gap-3 text-sm font-bold md:col-span-2">
        <input name="available" type="checkbox" defaultChecked={v?.available ?? true} className="h-5 w-5 accent-ink" />
        Tampilkan di web
      </label>
      <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-black md:col-span-2">
        {v ? "Simpan perubahan" : "Simpan kendaraan"}
      </button>
    </form>
  );
}
