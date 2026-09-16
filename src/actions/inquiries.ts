"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getWhatsappNumber } from "@/lib/settings";
import { buildInquiryMessage, type InquiryInput } from "@/lib/inquiries";

/**
 * Simpan lead ke tabel inquiries, kembalikan URL WhatsApp.
 * Insert boleh gagal (mis. env belum diset) — URL tetap dikembalikan
 * agar user tidak pernah terblokir.
 */
export async function submitInquiry(input: InquiryInput): Promise<string> {
  const number = await getWhatsappNumber();
  try {
    await supabaseAdmin().from("inquiries").insert({
      type: input.type,
      title: input.title,
      name: input.name ?? null,
      payload: input.payload,
    });
  } catch {
    /* lead tidak tersimpan, tapi booking via WA tetap jalan */
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(buildInquiryMessage(input))}`;
}
