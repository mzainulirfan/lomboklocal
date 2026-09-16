import Link from "next/link";
import { ArrowUpRight, Car, Inbox, Map, Van } from "lucide-react";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { PanelHeader, EmptyState } from "./ui";

async function getStats() {
  const sb = supabaseAdmin();
  const [vehicles, tours, routes, leads, leadsToday] = await Promise.all([
    sb.from("vehicles").select("id, available", { count: "exact" }),
    sb.from("tours").select("id, published", { count: "exact" }),
    sb.from("transfer_routes").select("id", { count: "exact", head: true }),
    sb.from("inquiries").select("id", { count: "exact", head: true }),
    sb.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", new Date().toISOString().slice(0, 10)),
  ]);
  const { data: recent } = await sb
    .from("inquiries")
    .select("id, type, title, name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return {
    vehiclesTotal: vehicles.count ?? 0,
    vehiclesLive: (vehicles.data as { available: boolean }[] | null)?.filter((v) => v.available).length ?? 0,
    toursTotal: tours.count ?? 0,
    toursLive: (tours.data as { published: boolean }[] | null)?.filter((t) => t.published).length ?? 0,
    routes: routes.count ?? 0,
    leads: leads.count ?? 0,
    leadsToday: leadsToday.count ?? 0,
    recent: (recent ?? []) as { id: string; type: string; title: string; name: string | null; created_at: string }[],
  };
}

const cards = [
  { key: "vehicles", label: "Vehicles live", href: "/admin/vehicles", icon: Car },
  { key: "tours", label: "Tours live", href: "/admin/tours", icon: Map },
  { key: "routes", label: "Rute transfer", href: "/admin/routes", icon: Van },
  { key: "leads", label: "Total leads", href: "/admin/inquiries", icon: Inbox },
] as const;

export default async function AdminDashboard() {
  const configured = isSupabaseConfigured();
  const stats = configured ? await getStats() : null;

  return (
    <>
      <PanelHeader
        kicker="Overview"
        title="Dashboard."
        desc="Ringkasan konten web dan lead masuk. Semua perubahan di sini langsung tampil di web publik."
      />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
          <p className="text-black/60">
            Isi `.env.local` (lihat `.env.example`), run file migrasi di `supabase/migrations/` via
            SQL Editor, lalu restart `npm run dev`.
          </p>
        </div>
      )}

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.key}
                href={c.href}
                className="group rounded-[1.75rem] bg-white p-6 transition hover:-translate-y-0.5"
              >
                <c.icon size={22} strokeWidth={1.75} className="text-ocean" />
                <p className="mt-6 text-4xl font-extrabold tracking-tight">
                  {c.key === "vehicles" && `${stats.vehiclesLive}/${stats.vehiclesTotal}`}
                  {c.key === "tours" && `${stats.toursLive}/${stats.toursTotal}`}
                  {c.key === "routes" && stats.routes}
                  {c.key === "leads" && stats.leads}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-black/50">
                  {c.label}
                  <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] bg-ink p-7 text-white sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight">
                Leads hari ini: {stats.leadsToday}
              </h2>
              <Link href="/admin/inquiries" className="text-sm font-bold text-white/60 hover:text-white">
                Semua leads ↗
              </Link>
            </div>
            <div className="mt-5 space-y-2.5">
              {stats.recent.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/5 px-5 py-3.5 text-sm">
                  <span className="font-bold">
                    {r.title} {r.name && <span className="font-normal text-white/50">· {r.name}</span>}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    {r.type} · {new Date(r.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
              {stats.recent.length === 0 && (
                <p className="text-sm text-white/50">Belum ada inquiry.</p>
              )}
            </div>
          </div>
        </>
      )}

      {configured === false && <EmptyState>Dashboard aktif setelah Supabase dikonfigurasi.</EmptyState>}
    </>
  );
}
