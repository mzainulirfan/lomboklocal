import { createRoute, updateRoute } from "../../actions";
import { input, label } from "../ui";
import type { TransferRouteRow } from "@/lib/transfers";

/** Form tambah/edit rute. `route` kosong = mode tambah. */
export function RouteForm({ route }: { route?: TransferRouteRow | null }) {
  const r = route ?? null;
  const action = r ? updateRoute : createRoute;

  return (
    <form action={action} className="grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
      {r && <input type="hidden" name="id" value={r.id} />}
      <div>
        <label className={label}>Dari</label>
        <input name="from_loc" defaultValue={r?.from_loc ?? "Lombok Airport"} className={input} />
      </div>
      <div>
        <label className={label}>Ke</label>
        <input name="to_loc" required placeholder="Kuta Lombok" defaultValue={r?.to_loc ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Harga (Rp)</label>
        <input name="price" inputMode="numeric" required placeholder="250000" defaultValue={r?.price ?? ""} className={input} />
      </div>
      <div>
        <label className={label}>Urutan tampil</label>
        <input name="sort_order" inputMode="numeric" defaultValue={r?.sort_order ?? 0} className={input} />
      </div>
      <button type="submit" className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-black md:col-span-2">
        {r ? "Simpan perubahan" : "Simpan rute"}
      </button>
    </form>
  );
}
