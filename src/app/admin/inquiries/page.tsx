import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { buildInquiryMessage, type InquiryInput } from "@/lib/inquiries";
import { getWhatsappNumber } from "@/lib/settings";
import { isAdmin, deleteInquiry } from "../actions";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

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

export default async function InquiriesPage() {
  if (!(await isAdmin())) redirect("/admin");
  const configured = isSupabaseConfigured();
  const number = await getWhatsappNumber();

  let rows: InquiryRow[] = [];
  if (configured) {
    try {
      const { data } = await supabaseAdmin()
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      rows = (data ?? []) as InquiryRow[];
    } catch {
      rows = [];
    }
  }

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
            <ArrowLeft size={16} /> Vehicles
          </Link>
          <SectionLabel>Leads masuk</SectionLabel>
          <h1 className="display text-5xl font-extrabold uppercase sm:text-6xl">Inquiries.</h1>

          {!configured && (
            <p className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm">
              Supabase belum dikonfigurasi — belum ada lead tersimpan.
            </p>
          )}

          {configured && rows.length === 0 && (
            <p className="mt-8 rounded-3xl bg-white p-8 text-center text-sm text-black/50">
              Belum ada inquiry. Setiap submit form transfer/contact/custom-trip dan tombol booking tour otomatis tercatat di sini.
            </p>
          )}

          <div className="mt-8 space-y-3">
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
        </Container>
      </main>
    </>
  );
}
