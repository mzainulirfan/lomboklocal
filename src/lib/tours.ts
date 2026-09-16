import { supabasePublic } from "@/lib/supabase";
import { formatRp } from "@/lib/format";
import { tours as fallbackTours, type Tour } from "@/content/site";

export type TourRow = {
  id: string;
  slug: string;
  title: string;
  area: string;
  duration: string;
  type: string;
  price_amount: number;
  price_note: string;
  image_url: string;
  description: string;
  included: string[];
  excluded: string[];
};

export type ItineraryRow = { time: string; place: string };

function toTour(row: TourRow, itinerary: ItineraryRow[]): Tour {
  return {
    slug: row.slug,
    title: row.title,
    area: row.area,
    duration: row.duration,
    type: row.type,
    price: formatRp(row.price_amount),
    priceNote: row.price_note,
    priceAmount: row.price_amount,
    image: row.image_url,
    description: row.description,
    itinerary,
    included: row.included,
    excluded: row.excluded,
  };
}

async function fetchToursWithItinerary(slug?: string): Promise<Tour[] | null> {
  const sb = supabasePublic();
  if (!sb) return null;
  let q = sb
    .from("tours")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (slug) q = q.eq("slug", slug);
  const { data: tours, error } = await q;
  if (error || !tours || tours.length === 0) return null;
  const ids = (tours as TourRow[]).map((t) => t.id);
  const { data: itin } = await sb
    .from("tour_itinerary")
    .select("tour_id, time, place, sort_order")
    .in("tour_id", ids)
    .order("sort_order", { ascending: true });
  const byTour = new Map<string, ItineraryRow[]>();
  for (const r of (itin ?? []) as { tour_id: string; time: string; place: string }[]) {
    const list = byTour.get(r.tour_id) ?? [];
    list.push({ time: r.time, place: r.place });
    byTour.set(r.tour_id, list);
  }
  return (tours as TourRow[]).map((t) => toTour(t, byTour.get(t.id) ?? []));
}

/** Daftar tour. Fallback ke konten statis bila DB belum siap. */
export async function getTours(): Promise<Tour[]> {
  try {
    return (await fetchToursWithItinerary()) ?? fallbackTours;
  } catch {
    return fallbackTours;
  }
}

/** Detail tour by slug. Fallback ke konten statis. */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const rows = await fetchToursWithItinerary(slug);
    if (rows && rows.length > 0) return rows[0];
  } catch {
    /* fallback di bawah */
  }
  return fallbackTours.find((t) => t.slug === slug) ?? null;
}

/** Semua tour (termasuk draft) + itinerary — untuk halaman admin. */
export async function getAllToursAdmin(): Promise<(TourRow & { published: boolean; itinerary: (ItineraryRow & { id: string })[] })[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data: tours } = await sb.from("tours").select("*").order("sort_order", { ascending: true });
  if (!tours) return [];
  const ids = (tours as TourRow[]).map((t) => t.id);
  const { data: itin } = ids.length
    ? await sb.from("tour_itinerary").select("id, tour_id, time, place, sort_order").in("tour_id", ids).order("sort_order", { ascending: true })
    : { data: [] };
  const byTour = new Map<string, (ItineraryRow & { id: string })[]>();
  for (const r of (itin ?? []) as { id: string; tour_id: string; time: string; place: string }[]) {
    const list = byTour.get(r.tour_id) ?? [];
    list.push({ id: r.id, time: r.time, place: r.place });
    byTour.set(r.tour_id, list);
  }
  return (tours as (TourRow & { published: boolean })[]).map((t) => ({
    ...t,
    itinerary: byTour.get(t.id) ?? [],
  }));
}
