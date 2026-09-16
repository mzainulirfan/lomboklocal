import { supabasePublic } from "@/lib/supabase";
import { formatRp } from "@/lib/format";
import { transferRoutes as fallbackRoutes } from "@/content/site";

export type TransferRoute = { from: string; to: string; price: string };

export type TransferRouteRow = {
  id: string;
  from_loc: string;
  to_loc: string;
  price: number;
  sort_order: number;
};

export async function getTransferRoutes(): Promise<TransferRoute[]> {
  const sb = supabasePublic();
  if (!sb) return fallbackRoutes;
  try {
    const { data, error } = await sb
      .from("transfer_routes")
      .select("from_loc, to_loc, price")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackRoutes;
    return (data as { from_loc: string; to_loc: string; price: number }[]).map((r) => ({
      from: r.from_loc,
      to: r.to_loc,
      price: formatRp(r.price),
    }));
  } catch {
    return fallbackRoutes;
  }
}

/** Semua rute (dengan id) — untuk halaman admin. */
export async function getAllRoutesAdmin(): Promise<TransferRouteRow[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data } = await sb
    .from("transfer_routes")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as TransferRouteRow[];
}
