import Link from "next/link";
import { Clock, Eye, EyeOff, MapPin, Pencil, Plus, Search } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllToursAdmin } from "@/lib/tours";
import { formatRp } from "@/lib/format";
import { deleteTour, toggleTour } from "../../actions";
import { PanelHeader, EmptyState, ViewLink } from "../ui";
import { ConfirmButton } from "../ConfirmButton";
import { Flash } from "../Flash";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "all", label: "Semua" },
  { key: "live", label: "Live" },
  { key: "draft", label: "Draft" },
] as const;

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; error?: string; saved?: string }>;
}) {
  const { status, q, error, saved } = await searchParams;
  const active = status === "draft" ? "draft" : status === "live" ? "live" : "all";
  const query = (q ?? "").trim().toLowerCase();
  const configured = isSupabaseConfigured();
  const all = configured ? await getAllToursAdmin() : [];
  const liveCount = all.filter((t) => t.published).length;
  const byStatus =
    active === "live" ? all.filter((t) => t.published) : active === "draft" ? all.filter((t) => !t.published) : all;
  const list = query
    ? byStatus.filter((t) => `${t.title} ${t.area} ${t.slug}`.toLowerCase().includes(query))
    : byStatus;

  return (
    <>
      <PanelHeader
        kicker="Trips"
        title="Tours."
        desc={`${all.length} tour · ${liveCount} tampil di web. Itinerary diatur di halaman edit.`}
        action={
          <Link
            href="/admin/tours/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
          >
            <Plus size={16} /> Tambah
          </Link>
        }
      />

      <Flash error={error} saved={saved} />

      {configured && (
        <>
          <form method="get" action="/admin/tours" className="mt-8 flex gap-2">
            {active !== "all" && <input type="hidden" name="status" value={active} />}
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Cari tour…"
                className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm font-bold placeholder:font-normal placeholder:text-black/35"
              />
            </div>
            <button type="submit" className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">
              Cari
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const count = t.key === "all" ? all.length : t.key === "live" ? liveCount : all.length - liveCount;
              return (
                <Link
                  key={t.key}
                  href={t.key === "all" ? "/admin/tours" : `/admin/tours?status=${t.key}`}
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
              <EmptyState>Belum ada tour — tambah yang pertama.</EmptyState>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {list.map((t) => (
              <article key={t.id} className="group overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative aspect-[16/9] bg-sand">
                  {t.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image_url} alt={t.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-black/30">
                      Tanpa foto
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur",
                      t.published ? "bg-ink/85 text-white" : "bg-white/90 text-black/50"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", t.published ? "bg-emerald-400" : "bg-black/30")} />
                    {t.published ? "Live" : "Draft"}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-black/60 backdrop-blur">
                    {t.itinerary.length} stop
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight">{t.title}</h2>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-black/50">
                        <MapPin size={13} /> {t.area || "—"}
                        <span className="text-black/20">·</span>
                        <Clock size={13} /> {t.duration}
                      </p>
                    </div>
                    <p className="shrink-0 font-extrabold">{formatRp(t.price_amount)}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-black/5 pt-4">
                    <form action={toggleTour}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="published" value={String(t.published)} />
                      <input type="hidden" name="slug" value={t.slug} />
                      <button
                        type="submit"
                        title={t.published ? "Jadikan draft" : "Tampilkan di web"}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold transition hover:border-ink"
                      >
                        {t.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        {t.published ? "Hide" : "Show"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/tours/${t.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                    >
                      <Pencil size={14} /> Edit + itinerary
                    </Link>
                    <ConfirmButton
                      action={deleteTour}
                      fields={{ id: t.id, slug: t.slug }}
                      itemName={t.title}
                      title="Hapus"
                      icon
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ViewLink href="/tours">halaman tours</ViewLink>
        </>
      )}
    </>
  );
}
