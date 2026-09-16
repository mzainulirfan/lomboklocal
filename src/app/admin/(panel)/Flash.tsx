"use client";

import { useState } from "react";
import { CheckCircle2, X, AlertTriangle } from "lucide-react";

/**
 * Banner sukses/gagal dari query `?saved=1` / `?error=...` (server redirect).
 * Bisa di-dismiss, tidak menghilangkan isi form.
 */
export function Flash({ error, saved }: { error?: string; saved?: string }) {
  const [gone, setGone] = useState(false);
  if (gone || (!error && !saved)) return null;

  const ok = !error;
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`mt-6 flex items-start gap-3 rounded-3xl p-5 text-sm leading-6 ${
        ok ? "bg-emerald-500/10 text-emerald-900" : "bg-coral/10 text-coral"
      }`}
    >
      {ok ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
      ) : (
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      )}
      <p className="flex-1 font-bold">
        {ok ? "Tersimpan. Perubahan langsung tampil di web." : error}
      </p>
      <button
        type="button"
        onClick={() => setGone(true)}
        aria-label="Tutup notifikasi"
        className="rounded-full p-1 transition hover:bg-black/5"
      >
        <X size={16} />
      </button>
    </div>
  );
}
