import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Inbox, LogOut, Pencil, Plus } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllVehiclesAdmin } from "@/lib/vehicles";
import { formatRp } from "@/lib/format";
import { isAdmin, login, logout, upsertVehicle, deleteVehicle, toggleVehicle } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const input =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-black/30";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await isAdmin();
  const { error } = await searchParams;

  if (!authed) {
    return (
      <>
        <SiteHeader dark={false} />
        <main className="bg-sand pt-32">
          <Container className="max-w-md pb-24">
            <SectionLabel>Admin</SectionLabel>
            <h1 className="display text-5xl font-extrabold uppercase">Login.</h1>
            <form action={login} className="mt-8 rounded-[2rem] bg-white p-8">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-black/40">
                Password admin
              </label>
              <input id="password" name="password" type="password" required className={input} />
              {error && (
                <p className="mt-3 text-sm font-bold text-coral">Password salah, coba lagi.</p>
              )}
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white"
              >
                Masuk
              </button>
            </form>
          </Container>
        </main>
      </>
    );
  }

  const configured = isSupabaseConfigured();
  const vehicles = configured ? await getAllVehiclesAdmin() : [];

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <div className="flex items-start justify-between gap-6">
            <div>
              <SectionLabel>Kelola rental</SectionLabel>
              <h1 className="display text-5xl font-extrabold uppercase sm:text-6xl">Vehicles.</h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
              >
                <Inbox size={15} /> Leads
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-bold"
                >
                  <LogOut size={15} /> Keluar
                </button>
              </form>
            </div>
          </div>

          {!configured && (
            <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
              <p className="font-bold">Supabase belum dikonfigurasi.</p>
              <p className="text-black/60">
                Isi `.env.local` (lihat `.env.example`), run migrasi SQL di dashboard Supabase,
                lalu restart `npm run dev`. Selama belum dikonfigurasi, halaman rental memakai
                data statis.
              </p>
            </div>
          )}

          {configured && (
            <>
              {/* Form tambah */}
              <form
                action={upsertVehicle}
                className="mt-8 grid gap-4 rounded-[2rem] bg-white p-8 md:grid-cols-2"
              >
                <p className="flex items-center gap-2 font-extrabold md:col-span-2">
                  <Plus size={17} /> Tambah kendaraan
                </p>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Kategori</label>
                  <select name="category" className={input} defaultValue="scooter">
                    <option value="scooter">Scooter</option>
                    <option value="car">Car</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Nama</label>
                  <input name="name" required placeholder="Honda Scoopy" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Spec</label>
                  <input name="spec" placeholder="Automatic · 2 persons" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Harga harian (Rp)</label>
                  <input name="daily_price" inputMode="numeric" required placeholder="75000" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Harga mingguan (opsional)</label>
                  <input name="weekly_price" inputMode="numeric" placeholder="450000" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Urutan</label>
                  <input name="sort_order" inputMode="numeric" defaultValue="0" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Foto (upload, maks 5MB)</label>
                  <input name="photo" type="file" accept="image/*" className={input} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">atau URL foto</label>
                  <input name="image_url" placeholder="https://…" className={input} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40">Perks (satu per baris)</label>
                  <textarea name="perks" rows={3} placeholder={"2 helmets\nPhone holder"} className={input} />
                </div>
                <label className="flex items-center gap-3 text-sm font-bold md:col-span-2">
                  <input name="available" type="checkbox" defaultChecked className="h-5 w-5" /> Tampilkan di web
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white md:col-span-2"
                >
                  Simpan kendaraan
                </button>
              </form>

              {/* Daftar */}
              <div className="mt-8 space-y-3">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {v.image_url && <img src={v.image_url} alt={v.name} className="h-16 w-24 rounded-2xl object-cover" />}
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                        {v.category} · {v.available ? "tampil" : "disembunyikan"}
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
                        href={`/admin/${v.id}`}
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
                {vehicles.length === 0 && (
                  <p className="rounded-3xl bg-white p-8 text-center text-sm text-black/50">
                    Belum ada data — run migrasi SQL (seed) atau tambah manual di atas.
                  </p>
                )}
              </div>

              <p className="mt-8 text-sm text-black/50">
                Perubahan langsung tampil di{" "}
                <Link href="/rental/scooter" className="font-bold underline">
                  rental <ArrowUpRight size={13} className="inline" />
                </Link>
                .
              </p>
            </>
          )}
        </Container>
      </main>
    </>
  );
}
