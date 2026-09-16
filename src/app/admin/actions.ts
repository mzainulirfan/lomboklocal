"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, VEHICLE_IMAGE_BUCKET } from "@/lib/supabase";

const COOKIE = "ll_admin";
const REVALIDATE = ["/", "/rental/scooter", "/rental/car", "/admin"];

function revalidateAll() {
  for (const p of REVALIDATE) revalidatePath(p);
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(COOKIE)?.value === "1";
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Login password sederhana (env ADMIN_PASSWORD). */
export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/admin/login");
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("inquiries").delete().eq("id", id);
  if (error) throw new Error(`Hapus gagal: ${error.message}`);
  revalidatePath("/admin/inquiries");
}

async function uploadPhoto(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("Foto maksimal 5MB.");
  const ext = file.type.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(VEHICLE_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return sb.storage.from(VEHICLE_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function parsePerks(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOptionalInt(raw: string): number | null {
  const n = parseInt(String(raw ?? "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

/** Tambah atau update kendaraan (ditentukan oleh field id). */
export async function upsertVehicle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const category = String(formData.get("category") ?? "scooter");
  if (category !== "scooter" && category !== "car") throw new Error("Kategori tidak valid.");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Nama wajib diisi.");
  const spec = String(formData.get("spec") ?? "").trim();
  const daily = parseOptionalInt(String(formData.get("daily_price") ?? ""));
  if (daily == null) throw new Error("Harga harian wajib diisi (rupiah, angka).");
  const weekly = parseOptionalInt(String(formData.get("weekly_price") ?? ""));

  const photo = formData.get("photo");
  const uploaded = await uploadPhoto(photo instanceof File ? photo : null);
  const pastedUrl = String(formData.get("image_url") ?? "").trim();
  const image_url = uploaded ?? pastedUrl ?? undefined;

  const payload = {
    category,
    name,
    spec,
    daily_price: daily,
    weekly_price: weekly,
    ...(image_url !== undefined ? { image_url } : {}),
    perks: parsePerks(String(formData.get("perks") ?? "")),
    available: formData.get("available") === "on",
    sort_order: parseOptionalInt(String(formData.get("sort_order") ?? "")) ?? 0,
  };

  const sb = supabaseAdmin();
  const { error } = id
    ? await sb.from("vehicles").update(payload).eq("id", id)
    : await sb.from("vehicles").insert({ ...payload, image_url: payload.image_url ?? "" });
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidateAll();
  redirect("/admin/vehicles");
}

export async function deleteVehicle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("vehicles").delete().eq("id", id);
  if (error) throw new Error(`Hapus gagal: ${error.message}`);
  revalidateAll();
}

export async function toggleVehicle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const available = String(formData.get("available") ?? "") === "true";
  const { error } = await supabaseAdmin()
    .from("vehicles")
    .update({ available: !available })
    .eq("id", id);
  if (error) throw new Error(`Update gagal: ${error.message}`);
  revalidateAll();
}

/* ---------- Settings ---------- */

export async function upsertSetting(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  if (!key) throw new Error("Key wajib diisi.");
  const { error } = await supabaseAdmin()
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidatePath("/", "layout");
}

/* ---------- Transfer routes ---------- */

function revalidateTransfer() {
  revalidatePath("/transfer");
}

export async function createRoute(formData: FormData) {
  await requireAdmin();
  const to_loc = String(formData.get("to_loc") ?? "").trim();
  if (!to_loc) throw new Error("Tujuan wajib diisi.");
  const { error } = await supabaseAdmin().from("transfer_routes").insert({
    from_loc: String(formData.get("from_loc") ?? "Lombok Airport").trim() || "Lombok Airport",
    to_loc,
    price: parseOptionalInt(String(formData.get("price") ?? "")) ?? 0,
    sort_order: parseOptionalInt(String(formData.get("sort_order") ?? "")) ?? 0,
  });
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidateTransfer();
  redirect("/admin/routes");
}

export async function updateRoute(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const to_loc = String(formData.get("to_loc") ?? "").trim();
  if (!to_loc) throw new Error("Tujuan wajib diisi.");
  const { error } = await supabaseAdmin()
    .from("transfer_routes")
    .update({
      from_loc: String(formData.get("from_loc") ?? "Lombok Airport").trim() || "Lombok Airport",
      to_loc,
      price: parseOptionalInt(String(formData.get("price") ?? "")) ?? 0,
      sort_order: parseOptionalInt(String(formData.get("sort_order") ?? "")) ?? 0,
    })
    .eq("id", id);
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidateTransfer();
  redirect("/admin/routes");
}

export async function deleteRoute(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("transfer_routes").delete().eq("id", id);
  if (error) throw new Error(`Hapus gagal: ${error.message}`);
  revalidateTransfer();
}

/* ---------- Tours ---------- */

function slugify(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateTour(slug?: string) {
  revalidatePath("/tours");
  revalidatePath("/");
  if (slug) revalidatePath(`/tours/${slug}`);
}

export async function upsertTour(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Judul wajib diisi.");
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const price = parseOptionalInt(String(formData.get("price_amount") ?? ""));
  if (price == null) throw new Error("Harga wajib diisi (rupiah, angka).");

  const photo = formData.get("photo");
  const uploaded = await uploadPhoto(photo instanceof File ? photo : null);
  const pastedUrl = String(formData.get("image_url") ?? "").trim();
  const image_url = uploaded ?? pastedUrl ?? undefined;

  const payload = {
    slug,
    title,
    area: String(formData.get("area") ?? "").trim(),
    duration: String(formData.get("duration") ?? "1 day").trim() || "1 day",
    type: String(formData.get("type") ?? "Private").trim() || "Private",
    price_amount: price,
    price_note: String(formData.get("price_note") ?? "").trim(),
    ...(image_url !== undefined ? { image_url } : {}),
    description: String(formData.get("description") ?? "").trim(),
    included: parsePerks(String(formData.get("included") ?? "")),
    excluded: parsePerks(String(formData.get("excluded") ?? "")),
    published: formData.get("published") === "on",
    sort_order: parseOptionalInt(String(formData.get("sort_order") ?? "")) ?? 0,
  };

  const sb = supabaseAdmin();
  const { error } = id
    ? await sb.from("tours").update(payload).eq("id", id)
    : await sb.from("tours").insert({ ...payload, image_url: payload.image_url ?? "" });
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidateTour(slug);
  redirect("/admin/tours");
}

export async function deleteTour(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "") || undefined;
  const { error } = await supabaseAdmin().from("tours").delete().eq("id", id);
  if (error) throw new Error(`Hapus gagal: ${error.message}`);
  revalidateTour(slug);
}

export async function toggleTour(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  const slug = String(formData.get("slug") ?? "") || undefined;
  const { error } = await supabaseAdmin()
    .from("tours")
    .update({ published: !published })
    .eq("id", id);
  if (error) throw new Error(`Update gagal: ${error.message}`);
  revalidateTour(slug);
}

/* ---------- Itinerary ---------- */

export async function addItinerary(formData: FormData) {
  await requireAdmin();
  const tour_id = String(formData.get("tour_id") ?? "");
  const time = String(formData.get("time") ?? "").trim();
  const place = String(formData.get("place") ?? "").trim();
  if (!time || !place) throw new Error("Jam dan tempat wajib diisi.");
  const slug = String(formData.get("slug") ?? "") || undefined;
  const { error } = await supabaseAdmin().from("tour_itinerary").insert({
    tour_id,
    time,
    place,
    sort_order: parseOptionalInt(String(formData.get("sort_order") ?? "")) ?? 0,
  });
  if (error) throw new Error(`Simpan gagal: ${error.message}`);
  revalidateTour(slug);
}

export async function deleteItinerary(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "") || undefined;
  const { error } = await supabaseAdmin().from("tour_itinerary").delete().eq("id", id);
  if (error) throw new Error(`Hapus gagal: ${error.message}`);
  revalidateTour(slug);
}
