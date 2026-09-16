"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

/** Input file dengan preview langsung (client). Bisa dipakai di dalam form server. */
export function PhotoField({
  name,
  label,
  current,
  labelClass,
}: {
  name?: string;
  label: string;
  current?: string;
  labelClass: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? current ?? null;

  return (
    <div>
      <span className={labelClass}>{label}</span>
      {shown && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shown}
          alt="Pratinjau foto"
          className="mt-2 h-28 w-full rounded-2xl border border-black/10 object-cover"
        />
      )}
      <label className="mt-2 flex cursor-pointer items-center gap-2.5 rounded-2xl border border-dashed border-black/20 bg-sand/50 px-4 py-3.5 text-sm font-bold text-black/60 transition hover:border-ink hover:text-ink">
        <ImagePlus size={17} className="shrink-0" />
        <span className="truncate">{preview ? "Foto dipilih ✓" : "Pilih foto (maks 5MB)"}</span>
        <input
          type="file"
          name={name ?? "photo"}
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return f ? URL.createObjectURL(f) : null;
            });
          }}
        />
      </label>
    </div>
  );
}
