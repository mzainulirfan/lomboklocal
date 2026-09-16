import { supabasePublic } from "@/lib/supabase";
import { formatRp } from "@/lib/format";
import { scooters as fallbackScooters, cars as fallbackCars, type Vehicle } from "@/content/site";

export type VehicleRow = {
  id: string;
  category: "scooter" | "car";
  name: string;
  spec: string;
  daily_price: number;
  weekly_price: number | null;
  image_url: string;
  perks: string[];
  available: boolean;
  sort_order: number;
  highlight?: string | null;
};

function toVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    name: row.name,
    spec: row.spec,
    highlight: row.highlight ?? undefined,
    daily: formatRp(row.daily_price),
    weekly: row.weekly_price ? formatRp(row.weekly_price) : undefined,
    image: row.image_url,
    perks: row.perks,
    dailyAmount: row.daily_price,
    weeklyAmount: row.weekly_price ?? undefined,
  };
}

/**
 * Ambil kendaraan dari Supabase. Fallback ke konten statis bila:
 * env belum diset, query gagal, atau tabel kosong.
 */
export async function getVehicles(category: "scooter" | "car"): Promise<Vehicle[]> {
  const fallback = category === "scooter" ? fallbackScooters : fallbackCars;
  const sb = supabasePublic();
  if (!sb) return fallback;
  try {
    const { data, error } = await sb
      .from("vehicles")
      .select("*")
      .eq("category", category)
      .eq("available", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return (data as VehicleRow[]).map(toVehicle);
  } catch {
    return fallback;
  }
}

/** Semua kendaraan (termasuk non-available) — untuk halaman admin. */
export async function getAllVehiclesAdmin(): Promise<VehicleRow[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data } = await sb
    .from("vehicles")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  return (data ?? []) as VehicleRow[];
}
