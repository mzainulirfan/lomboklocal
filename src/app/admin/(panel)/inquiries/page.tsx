import Link from "next/link";
import { MessageCircle, Trash2 } from "lucide-react";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { buildInquiryMessage, type InquiryInput } from "@/lib/inquiries";
import { getWhatsappNumber } from "@/lib/settings";
import { deleteInquiry } from "../../actions";
import { PanelHeader, EmptyState } from "../ui";
import { cn } from "@/lib/cn";

type InquiryRow = {
  id: string;
  type: string;
  title: string;
  name: string | null;
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

const filters = ["all", "tour", "vehicle", "transfer", "contact", "custom"];

const typeDot: Record<string, string> = {
  tour: "bg-ocean",
  vehicle: "bg-coral",
  transfer: "bg-emerald-500",
  contact: "bg-amber-500",
  custom: "bg-violet-500",
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

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active = filters.includes(type ?? "") ? (type as string) : "all";
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
      if (active !== "all") q = q.eq("type", active);
      const { data } = await q;
      rows = (data ?? []) as InquiryRow[];
    } catch {
      rows = [];
    }
  }

  return (
    <>
      <PanelHeader
        kicker="Leads masuk"
        title="Inquiries."
        desc="Setiap submit form transfer/contact/custom-trip dan tombol booking tour tercatat di sini. Follow up via WhatsApp."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/inquiries" : `/admin/inquiries?type=${f}`}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-bold transition",
              active === f ? "bg-ink text-white" : "bg-white hover:bg-black/5"
            )}
          >
            {f === "all" ? "Semua" : (typeLabel[f] ?? f)}
          </Link>
        ))}
      </div>

      {!configured && (
        <p className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm">
          Supabase belum dikonfigurasi — belum ada lead tersimpan.
        </p>
      )}

      {configured && rows.length === 0 && <div className="mt-8"><EmptyState>Belum ada inquiry{active !== "all" ? ` tipe ${typeLabel[active]}` : ""}.</EmptyState></div>}

      <div className="mt-6 space-y-3">
        {rows.map((r) => {
          const input: InquiryInput = {
            type: (r.type as InquiryInput["type"]) ?? "contact",
            title: r.title,
            name: r.name ?? undefined,
            payload: r.payload ?? {},
          };
          let followUp = "#";
          try {
            followUp = `https://wa.me/${number}?text=${encodeURIComponent(buildInquiryMessage(input))}`;
          } catch {
            /* biarkan # */
          }
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
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-extrabold uppercase tracking-widest text-black/40">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-black/60">
                      <span className={cn("h-1.5 w-1.5 rounded-full", typeDot[r.type] ?? "bg-black/30")} />
                      {typeLabel[r.type] ?? r.type}
                    </span>
                    {timeAgo(r.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={followUp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Follow up via WhatsApp"
                    aria-label={`Follow up ${r.title}`}
                    className="rounded-full bg-ink p-2.5 text-white transition hover:bg-black"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <form action={deleteInquiry}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      title="Hapus"
                      aria-label={`Hapus inquiry ${r.title}`}
                      className="rounded-full bg-coral/10 p-2.5 text-coral transition hover:bg-coral hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
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
            </div>
          );
        })}
      </div>
    </>
  );
}
