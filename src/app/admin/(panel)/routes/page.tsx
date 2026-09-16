import Link from "next/link";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllRoutesAdmin } from "@/lib/transfers";
import { formatRp } from "@/lib/format";
import { deleteRoute } from "../../actions";
import { PanelHeader, EmptyState, ViewLink } from "../ui";
import { ConfirmButton } from "../ConfirmButton";
import { Flash } from "../Flash";

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const configured = isSupabaseConfigured();
  const routes = configured ? await getAllRoutesAdmin() : [];

  return (
    <>
      <PanelHeader
        kicker="Transport"
        title="Transfer."
        desc={`${routes.length} rute antar-jemput. Perubahan harga langsung tampil di form booking transfer.`}
        action={
          <Link
            href="/admin/routes/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
          >
            <Plus size={16} /> Tambah
          </Link>
        }
      />

      <Flash error={error} saved={saved} />

      {configured && (
        <>
          {routes.length === 0 && (
            <div className="mt-8">
              <EmptyState>Belum ada rute — tambah yang pertama.</EmptyState>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {routes.map((r, i) => (
              <article key={r.id} className="rounded-[1.75rem] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                    Rute {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-xl font-extrabold tracking-tight">{formatRp(r.price)}</p>
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-extrabold tracking-tight">
                  {r.from_loc}
                  <ArrowRight size={17} className="shrink-0 text-ocean" />
                  {r.to_loc}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-black/5 pt-4">
                  <Link
                    href={`/admin/routes/${r.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                  >
                    <Pencil size={14} /> Edit harga
                  </Link>
                  <ConfirmButton
                    action={deleteRoute}
                    fields={{ id: r.id }}
                    itemName={`rute ke ${r.to_loc}`}
                    title="Hapus rute"
                    icon
                  />
                </div>
              </article>
            ))}
          </div>

          <ViewLink href="/transfer">halaman transfer</ViewLink>
        </>
      )}
    </>
  );
}
