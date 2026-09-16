import { Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllRoutesAdmin } from "@/lib/transfers";
import { formatRp } from "@/lib/format";
import { createRoute, updateRoute, deleteRoute } from "../../actions";
import { PanelHeader, EmptyState, ViewLink, input, label } from "../ui";

export default async function RoutesPage() {
  const configured = isSupabaseConfigured();
  const routes = configured ? await getAllRoutesAdmin() : [];

  return (
    <>
      <PanelHeader
        kicker="Transport"
        title="Transfer."
        desc="Harga rute antar-jemput. Perubahan langsung tampil di form booking transfer."
      />

      {configured && (
        <>
          <form action={createRoute} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
            <p className="flex items-center gap-2 font-extrabold md:col-span-2">
              <Plus size={17} /> Tambah rute
            </p>
            <div>
              <label className={label}>Dari</label>
              <input name="from_loc" defaultValue="Lombok Airport" className={input} />
            </div>
            <div>
              <label className={label}>Ke</label>
              <input name="to_loc" required placeholder="Kuta Lombok" className={input} />
            </div>
            <div>
              <label className={label}>Harga (Rp)</label>
              <input name="price" inputMode="numeric" required placeholder="250000" className={input} />
            </div>
            <div>
              <label className={label}>Urutan</label>
              <input name="sort_order" inputMode="numeric" defaultValue={routes.length + 1} className={input} />
            </div>
            <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white md:col-span-2">
              Simpan rute
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {routes.map((r) => (
              <div key={r.id} className="rounded-3xl bg-white p-5">
                <form
                  action={updateRoute}
                  className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_130px_90px_auto]"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <div>
                    <label className={label}>Dari</label>
                    <input name="from_loc" defaultValue={r.from_loc} className={input} />
                  </div>
                  <div>
                    <label className={label}>Ke</label>
                    <input name="to_loc" required defaultValue={r.to_loc} className={input} />
                  </div>
                  <div>
                    <label className={label}>Harga (Rp)</label>
                    <input name="price" inputMode="numeric" required defaultValue={r.price} className={input} />
                  </div>
                  <div>
                    <label className={label}>Urutan</label>
                    <input name="sort_order" inputMode="numeric" defaultValue={r.sort_order} className={input} />
                  </div>
                  <button type="submit" className="rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white">
                    Simpan
                  </button>
                </form>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-black/40">Tampil sebagai {formatRp(r.price)}</p>
                  <form action={deleteRoute}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral">
                      Hapus rute
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {routes.length === 0 && <EmptyState>Belum ada rute.</EmptyState>}
          </div>

          <ViewLink href="/transfer">halaman transfer</ViewLink>
        </>
      )}
    </>
  );
}
