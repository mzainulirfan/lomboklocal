import Link from "next/link";
import { Inbox } from "lucide-react";
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
            <div key={r.id} className="rounded-3xl bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ocean">
                    {typeLabel[r.type] ?? r.type} ·{" "}
                    {new Date(r.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <p className="mt-1 font-extrabold">
                    {r.title} {r.name ? <span className="font-normal text-black/50">· {r.name}</span> : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={followUp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <Inbox size={14} /> Follow up
                  </a>
                  <form action={deleteInquiry}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="rounded-full bg-coral/10 px-4 py-2.5 text-sm font-bold text-coral">
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
              {r.payload && Object.keys(r.payload).length > 0 && (
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-black/60 sm:grid-cols-2">
                  {Object.entries(r.payload).map(([k, val]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="font-bold capitalize">{k}:</dt>
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
