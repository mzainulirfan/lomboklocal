"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getWhatsappNumber } from "@/lib/settings";
import { buildInquiryMessage, normalizePhone, type InquiryInput } from "@/lib/inquiries";

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function genRefCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `LL-${s}`;
}

/**
 * Simpan lead ke tabel inquiries, kembalikan URL WhatsApp + kode booking.
 * Kode selalu ada (untuk pesan WA) walau insert gagal — agar user
 * tidak pernah terblokir.
 */
export async function submitInquiry(
  input: InquiryInput
): Promise<{ url: string; refCode: string }> {
  const number = await getWhatsappNumber();
  const phone = normalizePhone(input.phone);
  const refCode = genRefCode();
  try {
    const admin = supabaseAdmin();
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = attempt === 0 ? refCode : genRefCode();
      const { error } = await admin.from("inquiries").insert({
        type: input.type,
        title: input.title,
        name: input.name ?? null,
        phone,
        ref_code: code,
        payload: phone ? { ...input.payload, phone } : input.payload,
      });
      if (!error) {
        return {
          url: buildUrl(number, input, code),
          refCode: code,
        };
      }
      // Kode bentrok (sangat jarang) → coba lagi; selain itu abaikan.
      if (error.code !== "23505") break;
    }
  } catch {
    /* lead tidak tersimpan, tapi booking via WA tetap jalan */
  }
  return { url: buildUrl(number, input, refCode), refCode };
}

function buildUrl(number: string, input: InquiryInput, refCode: string) {
  const message = `${buildInquiryMessage(input)}\n\nRef: ${refCode}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
