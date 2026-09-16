import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { supabasePublic } from "@/lib/supabase";
import type { VehicleRow } from "@/lib/vehicles";
import { isAdmin, upsertVehicle } from "../actions";

export const metadata: Metadata = {
  title: "Edit kendaraan",
  robots: { index: false, follow: false },
};

const input =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-black/30";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const sb = supabasePublic();
  const { data } = sb ? await sb.from("vehicles").select("*").eq("id", id).single() : { data: null };
  const v = data as VehicleRow | null;
  if (!v) notFound();

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="max-w-2xl pb-24">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <SectionLabel>Edit</SectionLabel>
          <h1 className="display text-5xl font-extrabold uppercase">{v.name}</h1>
          <form action={upsertVehicle} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-8">
            <input type="hidden" name="id" value={v.id} />
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Kategori</label>
              <select name="category" className={input} defaultValue={v.category}>
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Nama</label>
              <input name="name" required defaultValue={v.name} className={input} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Spec</label>
              <input name="spec" defaultValue={v.spec} className={input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Harian (Rp)</label>
                <input name="daily_price" inputMode="numeric" required defaultValue={v.daily_price} className={input} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-black/40">Mingguan</label>
                <input name="weekly_price" inputMode="numeric" defaultValue={v.weekly_price ?? ""} className={input} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Urutan</label>
              <input name="sort_order" inputMode="numeric" defaultValue={v.sort_order} className={input} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">
                Ganti foto (kosongkan bila tidak diganti)
              </label>
              <input name="photo" type="file" accept="image/*" className={input} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">URL foto saat ini</label>
              <input name="image_url" defaultValue={v.image_url} className={input} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-black/40">Perks (satu per baris)</label>
              <textarea name="perks" rows={4} defaultValue={v.perks.join("\n")} className={input} />
            </div>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input name="available" type="checkbox" defaultChecked={v.available} className="h-5 w-5" /> Tampilkan di web
            </label>
            <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white">
              Simpan perubahan
            </button>
          </form>
        </Container>
      </main>
    </>
  );
}
