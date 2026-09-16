import { cache } from "react";
import { supabasePublic } from "@/lib/supabase";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const DEFAULT_SETTINGS = {
  whatsapp_number: WHATSAPP_NUMBER,
  contact_phone_display: "+62 812-3456-7890",
  contact_hours: "daily 07:00–21:00 WITA",
  base_location: "Kuta, South Lombok · delivery & pickup available",
  instagram_url: "",
  google_maps_url: "",
  usd_rate: "16000",
  hero_image_url: "",
  hero_image_alt: "",
} as const;

/** Seluruh settings (cached per request). Fallback ke default bila DB belum siap. */
export const getSiteSettings = cache(async (): Promise<Record<string, string>> => {
  const sb = supabasePublic();
  if (!sb) return { ...DEFAULT_SETTINGS };
  try {
    const { data, error } = await sb.from("site_settings").select("key, value");
    if (error || !data) return { ...DEFAULT_SETTINGS };
    const out: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of data as { key: string; value: string }[]) {
      if (row.value) out[row.key] = row.value;
    }
    return out;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
});

export async function getWhatsappNumber(): Promise<string> {
  return (await getSiteSettings()).whatsapp_number || WHATSAPP_NUMBER;
}

/** Kurs Rp per $1 untuk hint USD. */
export async function getUsdRate(): Promise<number> {
  const raw = (await getSiteSettings()).usd_rate ?? "";
  const n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 16000;
}

/** Semua settings mentah — untuk halaman admin. */
export async function getAllSettingsAdmin(): Promise<{ key: string; value: string }[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data } = await sb.from("site_settings").select("key, value").order("key");
  return (data ?? []) as { key: string; value: string }[];
}

export const SETTING_LABELS: Record<string, { label: string; hint: string }> = {
  whatsapp_number: { label: "Nomor WhatsApp", hint: "Format internasional tanpa +, cth 6281234567890. Dipakai SEMUA tombol WA." },
  contact_phone_display: { label: "Nomor tampil", hint: "Teks nomor di halaman kontak, cth +62 812-3456-7890." },
  contact_hours: { label: "Jam kontak", hint: "Cth daily 07:00–21:00 WITA." },
  base_location: { label: "Lokasi base", hint: "Cth Kuta, South Lombok." },
  instagram_url: { label: "Instagram URL", hint: "Link profil, cth https://instagram.com/… Kosongkan = disembunyikan." },
  google_maps_url: { label: "Google Maps URL", hint: "Link lokasi di Maps. Kosongkan = disembunyikan." },
  usd_rate: { label: "Kurs USD (Rp per $1)", hint: "Untuk tampilan ≈ $… Cth 16000. Update berkala." },
  hero_image_url: { label: "Foto hero homepage", hint: "URL foto besar homepage. Upload via Galeri lalu tempel URL-nya, atau kosongkan = default." },
  hero_image_alt: { label: "Alt text hero", hint: "Deskripsi foto untuk SEO & aksesibilitas." },
};
