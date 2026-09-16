import Link from "next/link";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllGalleryAdmin } from "@/lib/gallery";
import { deleteGallery, toggleGallery, updateGallery } from "../../actions";
import { PanelHeader, EmptyState, ViewLink, input, label } from "../ui";
import { GalleryAddForm } from "./GalleryAddForm";
import { ConfirmButton } from "../ConfirmButton";
import { Flash } from "../Flash";
import { cn } from "@/lib/cn";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const configured = isSupabaseConfigured();
  const photos = configured ? await getAllGalleryAdmin() : [];

  return (
    <>
      <PanelHeader
        kicker="Homepage"
        title="Galeri."
        desc={`${photos.length} foto · yang tampil muncul di galeri homepage. Foto hero diatur terpisah di Settings.`}
        action={
          <Link
            href="/admin/settings"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-bold transition hover:border-ink"
          >
            Atur foto hero
          </Link>
        }
      />

      <Flash error={error} saved={saved} />

      {configured && (
        <>
          <GalleryAddForm nextOrder={photos.length + 1} />

          {photos.length === 0 && (
            <div className="mt-6">
              <EmptyState>Belum ada foto — run migrasi SQL (seed) atau tambah di atas.</EmptyState>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {photos.map((p, i) => (
              <article key={p.id} className="overflow-hidden rounded-[1.75rem] bg-white">
                <div className="relative aspect-[16/10] bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt={p.alt || "Galeri Lombok"} className="h-full w-full object-cover" loading="lazy" />
                  <span
                    className={cn(
                      "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur",
                      p.published ? "bg-ink/85 text-white" : "bg-white/90 text-black/50"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", p.published ? "bg-emerald-400" : "bg-black/30")} />
                    {p.published ? `Live · #${i + 1}` : "Draft"}
                  </span>
                </div>
                <form action={updateGallery} className="grid gap-3 p-5">
                  <input type="hidden" name="id" value={p.id} />
                  <div>
                    <label className={label}>Alt text</label>
                    <input name="alt" defaultValue={p.alt} className={input} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Urutan</label>
                      <input name="sort_order" inputMode="numeric" defaultValue={p.sort_order} className={input} />
                    </div>
                    <div>
                      <label className={label}>Ganti (upload/URL)</label>
                      <input name="photo" type="file" accept="image/*" className={input} />
                    </div>
                  </div>
                  <input type="hidden" name="image_url" value="" />
                  <label className="flex items-center gap-2.5 text-sm font-bold">
                    <input name="published" type="checkbox" defaultChecked={p.published} className="h-5 w-5 accent-ink" /> Tampil
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black">
                      <Pencil size={14} /> Simpan
                    </button>
                    <button
                      type="submit"
                      formAction={toggleGallery}
                      title={p.published ? "Sembunyikan" : "Tampilkan"}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2.5 text-sm font-bold transition hover:border-ink"
                    >
                      {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </form>
                <div className="px-5 pb-5">
                  <ConfirmButton
                    action={deleteGallery}
                    fields={{ id: p.id }}
                    itemName="foto ini"
                    title="Hapus foto"
                  />
                </div>
              </article>
            ))}
          </div>

          <ViewLink href="/">homepage</ViewLink>
        </>
      )}
    </>
  );
}
