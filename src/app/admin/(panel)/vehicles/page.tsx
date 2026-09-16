import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllVehiclesAdmin } from "@/lib/vehicles";
import { formatRp } from "@/lib/format";
import { upsertVehicle, deleteVehicle, toggleVehicle } from "../../actions";
import { PanelHeader, EmptyState, ViewLink, input, label } from "../ui";

export default async function VehiclesPage() {
  const configured = isSupabaseConfigured();
  const vehicles = configured ? await getAllVehiclesAdmin() : [];
  const scooters = vehicles.filter((v) => v.category === "scooter");
  const cars = vehicles.filter((v) => v.category === "car");

  return (
    <>
      <PanelHeader
        kicker="Rental"
        title="Vehicles."
        desc="Tambah, ubah harga, ganti foto, atau sembunyikan kendaraan. Yang bertanda tampil akan muncul di halaman rental."
      />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
          <p className="text-black/60">Isi `.env.local`, run migrasi SQL, restart dev server.</p>
        </div>
      )}

      {configured && (
        <>
          <form action={upsertVehicle} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
            <p className="flex items-center gap-2 font-extrabold md:col-span-2">
              <Plus size={17} /> Tambah kendaraan
            </p>
            <div>
              <label className={label}>Kategori</label>
              <select name="category" className={input} defaultValue="scooter">
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div>
              <label className={label}>Nama</label>
              <input name="name" required placeholder="Honda Scoopy" className={input} />
            </div>
            <div>
              <label className={label}>Spec</label>
              <input name="spec" placeholder="Automatic · 2 persons" className={input} />
            </div>
            <div>
              <label className={label}>Harga harian (Rp)</label>
              <input name="daily_price" inputMode="numeric" required placeholder="75000" className={input} />
            </div>
            <div>
              <label className={label}>Harga mingguan (opsional)</label>
              <input name="weekly_price" inputMode="numeric" placeholder="450000" className={input} />
            </div>
            <div>
              <label className={label}>Urutan</label>
              <input name="sort_order" inputMode="numeric" defaultValue="0" className={input} />
            </div>
            <div>
              <label className={label}>Foto (upload, maks 5MB)</label>
              <input name="photo" type="file" accept="image/*" className={input} />
            </div>
            <div>
              <label className={label}>atau URL foto</label>
              <input name="image_url" placeholder="https://…" className={input} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Perks (satu per baris)</label>
              <textarea name="perks" rows={3} placeholder={"2 helmets\nPhone holder"} className={input} />
            </div>
            <label className="flex items-center gap-3 text-sm font-bold md:col-span-2">
              <input name="available" type="checkbox" defaultChecked className="h-5 w-5" /> Tampilkan di web
            </label>
            <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white md:col-span-2">
              Simpan kendaraan
            </button>
          </form>

          {[
            { title: "Scooters", list: scooters },
            { title: "Cars", list: cars },
          ].map((group) => (
            <section key={group.title} className="mt-8">
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-black/40">
                {group.title} ({group.list.length})
              </h2>
              <div className="space-y-3">
                {group.list.map((v) => (
                  <div key={v.id} className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {v.image_url && <img src={v.image_url} alt={v.name} className="h-16 w-24 rounded-2xl object-cover" />}
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                        {v.available ? "tampil" : "disembunyikan"}
                      </p>
                      <p className="font-extrabold">
                        {v.name} · {formatRp(v.daily_price)}
                        {v.weekly_price ? ` / ${formatRp(v.weekly_price)}/mgg` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <form action={toggleVehicle}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="available" value={String(v.available)} />
                        <button type="submit" className="rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold">
                          {v.available ? "Sembunyikan" : "Tampilkan"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/vehicles/${v.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <form action={deleteVehicle}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" className="rounded-full bg-coral/10 px-4 py-2.5 text-sm font-bold text-coral">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
                {group.list.length === 0 && <EmptyState>Belum ada {group.title.toLowerCase()}.</EmptyState>}
              </div>
            </section>
          ))}

          <ViewLink href="/rental/scooter">halaman rental</ViewLink>
        </>
      )}
    </>
  );
}
