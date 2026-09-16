"use client";

import { useActionState } from "react";
import { AlertTriangle, ImagePlus } from "lucide-react";
import { createGallery, type ActionState } from "../../actions";
import { input, label } from "../ui";
import { PhotoField } from "../PhotoField";

/** Form tambah foto galeri. Error inline, isian aman. */
export function GalleryAddForm({ nextOrder }: { nextOrder: number }) {
  const [state, submit, pending] = useActionState<ActionState, FormData>(createGallery, null);

  return (
    <form action={submit} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 sm:p-8 md:grid-cols-2">
      <p className="flex items-center gap-2 font-extrabold md:col-span-2">
        <ImagePlus size={17} /> Tambah foto
      </p>
      {state?.error && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-bold text-coral md:col-span-2">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {state.error}
        </p>
      )}
      <PhotoField label="Foto (upload, maks 5MB)" labelClass={label} />
      <div>
        <label className={label}>atau URL foto</label>
        <input name="image_url" placeholder="https://…" className={input} />
      </div>
      <div>
        <label className={label}>Alt text (SEO)</label>
        <input name="alt" placeholder="Pantai Tanjung Aan" className={input} />
      </div>
      <div>
        <label className={label}>Urutan tampil</label>
        <input name="sort_order" inputMode="numeric" defaultValue={nextOrder} className={input} />
      </div>
      <label className="flex items-center gap-3 text-sm font-bold md:col-span-2">
        <input name="published" type="checkbox" defaultChecked className="h-5 w-5 accent-ink" /> Tampilkan di web
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60 md:col-span-2"
      >
        {pending ? "Menyimpan…" : "Simpan foto"}
      </button>
    </form>
  );
}
