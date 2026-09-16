import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { VehicleRow } from "@/lib/vehicles";
import { upsertVehicle } from "../../../actions";
import { PanelHeader, input, label } from "../../ui";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = supabasePublic();
  const { data } = sb ? await sb.from("vehicles").select("*").eq("id", id).single() : { data: null };
  const v = data as VehicleRow | null;
  if (!v) notFound();

  return (
    <>
      <Link href="/admin/vehicles" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Vehicles
      </Link>
      <div className="mt-4">
        <PanelHeader kicker="Rental" title={v.name} desc="Ubah detail kendaraan, lalu simpan." />
      </div>
      <form action={upsertVehicle} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8">
        <input type="hidden" name="id" value={v.id} />
        <div>
          <label className={label}>Kategori</label>
          <select name="category" className={input} defaultValue={v.category}>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
          </select>
        </div>
        <div>
          <label className={label}>Nama</label>
          <input name="name" required defaultValue={v.name} className={input} />
        </div>
        <div>
          <label className={label}>Spec</label>
          <input name="spec" defaultValue={v.spec} className={input} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Harian (Rp)</label>
            <input name="daily_price" inputMode="numeric" required defaultValue={v.daily_price} className={input} />
          </div>
          <div>
            <label className={label}>Mingguan</label>
            <input name="weekly_price" inputMode="numeric" defaultValue={v.weekly_price ?? ""} className={input} />
          </div>
        </div>
        <div>
          <label className={label}>Urutan</label>
          <input name="sort_order" inputMode="numeric" defaultValue={v.sort_order} className={input} />
        </div>
        <div>
          <label className={label}>Ganti foto (kosongkan bila tidak diganti)</label>
          <input name="photo" type="file" accept="image/*" className={input} />
        </div>
        <div>
          <label className={label}>URL foto saat ini</label>
          <input name="image_url" defaultValue={v.image_url} className={input} />
        </div>
        <div>
          <label className={label}>Perks (satu per baris)</label>
          <textarea name="perks" rows={4} defaultValue={v.perks.join("\n")} className={input} />
        </div>
        <label className="flex items-center gap-3 text-sm font-bold">
          <input name="available" type="checkbox" defaultChecked={v.available} className="h-5 w-5" /> Tampilkan di web
        </label>
        <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white">
          Simpan perubahan
        </button>
      </form>
    </>
  );
}
