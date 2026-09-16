"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

/**
 * Tombol hapus dengan dialog konfirmasi + cegah double-submit.
 * `action` = server action yang menerima FormData (wajib sertakan hidden field di `fields`).
 */
export function ConfirmButton({
  action,
  fields,
  itemName,
  title = "Hapus",
  icon = false,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  itemName: string;
  title?: string;
  icon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    try {
      await action(formData);
    } finally {
      // redirect dari action akan navigasi; bila gagal, tutup busy
      setBusy(false);
      setOpen(false);
    }
  }

  const trigger = icon ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      title={title}
      aria-label={`${title}: ${itemName}`}
      className="rounded-full bg-coral/10 p-2.5 text-coral transition hover:bg-coral hover:text-white"
    >
      <Trash2 size={16} />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="rounded-full bg-coral/10 px-4 py-2.5 text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
    >
      {title}
    </button>
  );

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          role="alertdialog"
          aria-modal="true"
          aria-label={`Konfirmasi hapus ${itemName}`}
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[1.75rem] bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-extrabold tracking-tight">Hapus {itemName}?</p>
            <p className="mt-2 text-sm leading-6 text-black/55">
              Data dihapus permanen dari web dan database. Tindakan ini tidak bisa dibatalkan.
            </p>
            <form action={submit} className="mt-5 grid grid-cols-2 gap-2">
              {Object.entries(fields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 px-4 py-3 text-sm font-bold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {busy ? "Menghapus…" : "Ya, hapus"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
