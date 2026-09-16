import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

/** Client publik (anon) — aman dipakai di Server Components untuk read. */
export function supabasePublic(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(url!, anonKey!);
}

/**
 * Client service-role — BYPASS RLS. Hanya dipakai di Server Actions /
 * Route Handlers (tidak pernah di client). Throw bila env belum diset.
 */
export function supabaseAdmin(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase service role belum dikonfigurasi (cek .env.local).");
  }
  return createClient(url, serviceKey);
}

export const VEHICLE_IMAGE_BUCKET = "vehicle-images";
