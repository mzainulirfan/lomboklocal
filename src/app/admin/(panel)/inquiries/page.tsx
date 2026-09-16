import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { buildInquiryMessage, type InquiryInput } from "@/lib/inquiries";
import { getWhatsappNumber } from "@/lib/settings";
import { deleteInquiry, setInquiryStatus } from "../../actions";
import { PanelHeader, EmptyState } from "../ui";
import { ConfirmButton } from "../ConfirmButton";
import { Flash } from "../Flash";
import { cn } from "@/lib/cn";

type InquiryRow = {
  id: string;
  type: string;
  title: string;
  name: string | null;
  phone: string | null;
  status: string;
  payload: Record<string, string>;
  created_at: string;
};

const typeLabel: Record<string, string> = {
  tour: "Tour",
  vehicle: "Rental",
  transfer: "Transfer",
  contact: "Contact",
  custom: "Custom trip",
};

const typeFilters = ["all", "tour", "vehicle", "transfer", "contact", "custom"];
const statuses = ["baru", "dihubungi", "deal", "batal"] as const;

const typeDot: Record<string, string> = {
  tour: "bg-ocean",
  vehicle: "bg-coral",
  transfer: "bg-emerald-500",
  contact: "bg-amber-500",
  custom: "bg-violet-500",
};

const statusStyle: Record<string, string> = {
  baru: "bg-ocean/10 text-ocean",
  dihubungi: "bg-amber-500/10 text-amber-700",
  deal: "bg-emerald-500/10 text-emerald-700",
  batal: "bg-black/5 text-black/40",
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function qs(base: string, params: Record<string, string | undefined>) {
  const q = Object.entries(params)
    .filter(([, v]) => v && v !== "all" && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return q ? `${base}?${q}` : base;
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; q?: string; error?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const type = typeFilters.includes(sp.type ?? "") ? (sp.type as string) : "all";
  const status = (statuses as readonly string[]).includes(sp.status ?? "") ? (sp.status as string) : "all";
  const query = (sp.q ?? "").trim().toLowerCase();
  const configured = isSupabaseConfigured();
  const number = await getWhatsappNumber();

  let rows: InquiryRow[] = [];
  if (configured) {
    try {
      let q = supabaseAdmin()
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (type !== "all") q = q.eq("type", type);
      if (status !== "all") q = q.eq("status", status);
      const { data } = await q;
      rows = (data ?? []) as InquiryRow[];
    } catch {
      rows = [];
    }
  }
  if (query) {
    rows = rows.filter((r) =>
      `${r.title} ${r.name ?? ""} ${Object.values(r.payload ?? {}).join(" ")}`.toLowerCase().includes(query)
    );
  }

  return (
    <>
      <PanelHeader
        kicker="Leads masuk"
        title="Inquiries."
        desc="Setiap submit form tercatat di sini. Ubah status setelah difollow-up agar tidak ada lead yang terlewat."
      />

      <Flash error={sp.error} saved={sp.saved} />

      <form method="get" action="/admin/inquiries" className="mt-8 flex gap-2">
        {type !== "all" && <input type="hidden" name="type" value={type} />}
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Cari nama, judul, detail…"
            className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm font-bold placeholder:font-normal placeholder:text-black/35"
          />
        </div>
        <button type="submit" className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">
          Cari
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <Link
            key={s}
            href={qs("/admin/inquiries", { type, status: s, q: sp.q })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition",
              (status === s ? "bg-ink text-white" : "bg-white hover:bg-black/5") +
                (s !== "all" ? ` ${statusStyle[s]}` : "")
            )}
          >
            {s === "all" ? "Semua status" : s}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <Link
            key={f}
            href={qs("/admin/inquiries", { type: f, status, q: sp.q })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition",
              type === f ? "bg-ink text-white" : "bg-white hover:bg-black/5"
            )}
          >
            {f === "all" ? "Semua tipe" : (typeLabel[f] ?? f)}
          </Link>
        ))}
      </div>

      {!configured && (
        <p className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm">
          Supabase belum dikonfigurasi — belum ada lead tersimpan.
        </p>
      )}

      {configured && rows.length === 0 && (
        <div className="mt-8"><EmptyState>Belum ada inquiry yang cocok.</EmptyState></div>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((r) => {
          const input: InquiryInput = {
            type: (r.type as InquiryInput["type"]) ?? "contact",
            title: r.title,
            name: r.name ?? undefined,
            payload: r.payload ?? {},
          };
          // Follow-up ke NOMOR PEMESAN. Bila lead lama tanpa nomor, fallback ke perilaku lama.
          const customerPhone = (r.phone ?? "").replace(/\D/g, "");
          let followUp = "#";
          let followTitle = `Follow up ${r.title}`;
          try {
            if (customerPhone) {
              const greet = `Halo ${r.name || "kak"}, kami dari Lombok Local menindaklanjuti inquiry: ${r.title}.`;
              followUp = `https://wa.me/${customerPhone}?text=${encodeURIComponent(greet)}`;
              followTitle = `Chat ${r.name || r.title} via WhatsApp`;
            } else {
              followUp = `https://wa.me/${number}?text=${encodeURIComponent(buildInquiryMessage(input))}`;
              followTitle = `Buka pesan inquiry (tanpa nomor pemesan)`;
            }
          } catch {
            /* biarkan # */
          }
          const st = (statuses as readonly string[]).includes(r.status) ? r.status : "baru";
          return (
            <div key={r.id} className="rounded-[1.75rem] bg-white p-5">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-lg font-extrabold text-white">
                  {(r.name ?? r.title).charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">
                    {r.title} {r.name ? <span className="font-normal text-black/50">· {r.name}</span> : null}
                  </p>
                  {customerPhone ? (
                    <a href={`https://wa.me/${customerPhone}`} target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-sm font-bold text-ocean hover:underline">
                      +{customerPhone}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs font-bold text-coral">Tanpa nomor — lead lama</p>
                  )}
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-black/60">
                      <span className={cn("h-1.5 w-1.5 rounded-full", typeDot[r.type] ?? "bg-black/30")} />
                      {typeLabel[r.type] ?? r.type}
                    </span>
                    <span className={cn("rounded-full px-2.5 py-1", statusStyle[st])}>{st}</span>
                    <span className="text-black/40">{timeAgo(r.created_at)}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={followUp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={followTitle}
                    aria-label={followTitle}
                    className="rounded-full bg-ink p-2.5 text-white transition hover:bg-black"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <ConfirmButton
                    action={deleteInquiry}
                    fields={{ id: r.id }}
                    itemName={`lead ${r.title}`}
                    title="Hapus lead"
                    icon
                  />
                </div>
              </div>
              {r.payload && Object.keys(r.payload).length > 0 && (
                <dl className="mt-4 grid gap-x-6 gap-y-1.5 rounded-2xl bg-sand/60 p-4 text-sm text-black/65 sm:grid-cols-2">
                  {Object.entries(r.payload).map(([k, val]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="shrink-0 font-bold capitalize">{k}:</dt>
                      <dd className="whitespace-pre-line">{String(val) || "-"}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <form action={setInquiryStatus} className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3">
                <input type="hidden" name="id" value={r.id} />
                <label htmlFor={`st-${r.id}`} className="text-xs font-bold uppercase tracking-widest text-black/40">
                  Status
                </label>
                <select
                  id={`st-${r.id}`}
                  name="status"
                  defaultValue={st}
                  className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white">
                  Simpan
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </>
  );
}
