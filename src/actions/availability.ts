"use server";

import { isDateBlocked as check, type AvailabilityItem } from "@/lib/availability";

/** Dipakai form booking publik untuk warning tanggal penuh. */
export async function checkDateBlocked(
  itemType: AvailabilityItem,
  itemId: string,
  date: string
): Promise<boolean> {
  return check(itemType, itemId, date);
}
