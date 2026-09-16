import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllVehiclesAdmin } from "@/lib/vehicles";
import { formatRp } from "@/lib/format";
import { deleteVehicle, toggleVehicle } from "../../actions";
import { PanelHeader, EmptyState, ViewLink } from "../ui";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "all", label: "Semua" },
  { key: "scooter", label: "Scooter" },
  { key: "car", label: "Car" },
] as const;

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category === "car" ? "car" : category === "scooter" ? "scooter" : "all";
  const configured = isSupabaseConfigured();
  const all = configured ? await getAllVehiclesAdmin() : [];
  const live = all.filter((v) => v.available).length;
  const list = active === "all" ? all : all.filter((v) => v.category === active);

  return (
    <>
      <PanelHeader
        kicker="Rental"
        title="Vehicles."
        desc={`${all.length} kendaraan · ${live} tampil di web. Klik kartu untuk edit, atau tambah unit baru.`}
        action={
          <Link
            href="/admin/vehicles/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
          >
            <Plus size={16} /> Tambah
          </Link>
        }
      />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
          <p className="text-black/60">Isi `.env.local`, run migrasi SQL, restart dev server.</p>
        </div>
      )}

      {configured && (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const count = t.key === "all" ? all.length : all.filter((v) => v.category === t.key).length;
              return (
                <Link
                  key={t.key}
                  href={t.key === "all" ? "/admin/vehicles" : `/admin/vehicles?category=${t.key}`}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-bold transition",
                    active === t.key ? "bg-ink text-white" : "bg-white hover:bg-black/5"
                  )}
                >
                  {t.label} · {count}
                </Link>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="mt-6">
              <EmptyState>Belum ada kendaraan{tabs.find((t) => t.key === active)?.label ? ` — tambah yang pertama.` : "."}</EmptyState>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {list.map((v) => (
              <article key={v.id} className="group overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative aspect-[16/9] bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {v.image_url ? (
                    <img src={v.image_url} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-black/30">
                      Tanpa foto
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest",
                      v.available ? "bg-ink/85 text-white backdrop-blur" : "bg-white/90 text-black/50 backdrop-blur"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", v.available ? "bg-emerald-400" : "bg-black/30")} />
                    {v.available ? "Live" : "Draft"}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-black/60 backdrop-blur">
                    {v.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight">{v.name}</h2>
                      <p className="mt-0.5 text-sm text-black/50">{v.spec || "—"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-extrabold">{formatRp(v.daily_price)}</p>
                      <p className="text-xs font-normal text-black/40">
                        {v.weekly_price ? `${formatRp(v.weekly_price)}/mgg` : "/hari"}
                      </p>
                    </div>
                  </div>

                  {v.perks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {v.perks.slice(0, 4).map((p) => (
                        <span key={p} className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-black/60">
                          {p}
                        </span>
                      ))}
                      {v.perks.length > 4 && (
                        <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-black/40">
                          +{v.perks.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-black/5 pt-4">
                    <form action={toggleVehicle}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="available" value={String(v.available)} />
                      <button
                        type="submit"
                        title={v.available ? "Sembunyikan dari web" : "Tampilkan di web"}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold transition hover:border-ink"
                      >
                        {v.available ? <EyeOff size={15} /> : <Eye size={15} />}
                        {v.available ? "Hide" : "Show"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/vehicles/${v.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                    <form action={deleteVehicle}>
                      <input type="hidden" name="id" value={v.id} />
                      <button
                        type="submit"
                        title="Hapus permanen"
                        aria-label={`Hapus ${v.name}`}
                        className="rounded-full bg-coral/10 p-2.5 text-coral transition hover:bg-coral hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ViewLink href="/rental/scooter">halaman rental</ViewLink>
        </>
      )}
    </>
  );
}
