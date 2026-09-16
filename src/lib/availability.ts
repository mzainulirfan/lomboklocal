import { supabasePublic } from "@/lib/supabase";

export type AvailabilityItem = "vehicle" | "tour";

/** True bila tanggal diblokir untuk item tersebut. False bila DB belum siap. */
export async function isDateBlocked(
  itemType: AvailabilityItem,
  itemId: string,
  date: string
): Promise<boolean> {
  if (!date || !itemId) return false;
  const sb = supabasePublic();
  if (!sb) return false;
  try {
    const { data, error } = await sb
      .from("availability_blocks")
      .select("id")
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .eq("date", date)
      .limit(1);
    if (error) return false;
    return (data ?? []).length > 0;
  } catch {
    return false;
  }
}

export type BlockRow = {
  id: string;
  item_type: AvailabilityItem;
  item_id: string;
  date: string;
  note: string;
};

/** Blokir pada rentang tanggal — untuk kalender admin. */
export async function getBlocksInRange(
  itemType: AvailabilityItem,
  itemId: string,
  from: string,
  to: string
): Promise<BlockRow[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data } = await sb
    .from("availability_blocks")
    .select("*")
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true });
  return (data ?? []) as BlockRow[];
}

/** Blokir mendatang semua item — untuk dashboard admin. */
export async function getUpcomingBlocks(limit = 20): Promise<BlockRow[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await sb
    .from("availability_blocks")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);
  return (data ?? []) as BlockRow[];
}
