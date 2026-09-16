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
  if (!(await isAdmin())) redirect("/admin");
}

/** Login password sederhana (env ADMIN_PASSWORD). */
export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
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
  redirect("/admin");
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
  redirect("/admin");
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
