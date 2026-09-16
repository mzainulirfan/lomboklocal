import { supabasePublic } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/settings";

export type GalleryImage = { src: string; alt: string };

const fallbackGallery: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", alt: "Lombok coastline" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Turquoise beach" },
  { src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80", alt: "Surfing in Lombok" },
  { src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80", alt: "Waterfall in Lombok" },
];

export const DEFAULT_HERO = {
  src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=85",
  alt: "Tropical coastline in Lombok, Indonesia",
};

/** Foto hero homepage (dari settings, fallback default). */
export async function getHero(): Promise<{ src: string; alt: string }> {
  try {
    const s = await getSiteSettings();
    if (s.hero_image_url) return { src: s.hero_image_url, alt: s.hero_image_alt || "Lombok" };
  } catch {
    /* fallback */
  }
  return DEFAULT_HERO;
}

/** Galeri homepage. Fallback ke konten statis bila DB belum siap. */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const sb = supabasePublic();
  if (!sb) return fallbackGallery;
  try {
    const { data, error } = await sb
      .from("gallery_images")
      .select("image_url, alt")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackGallery;
    return (data as { image_url: string; alt: string }[]).map((r) => ({
      src: r.image_url,
      alt: r.alt || "Lombok",
    }));
  } catch {
    return fallbackGallery;
  }
}

export type GalleryRow = {
  id: string;
  image_url: string;
  alt: string;
  published: boolean;
  sort_order: number;
};

/** Semua foto galeri (termasuk draft) — untuk halaman admin. */
export async function getAllGalleryAdmin(): Promise<GalleryRow[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data } = await sb
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as GalleryRow[];
}
