import { cache } from "react";
import { supabasePublic } from "@/lib/supabase";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const DEFAULT_SETTINGS = {
  whatsapp_number: WHATSAPP_NUMBER,
  contact_phone_display: "+62 812-3456-7890",
  contact_hours: "daily 07:00–21:00 WITA",
  base_location: "Kuta, South Lombok · delivery & pickup available",
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
};
