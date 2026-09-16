"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setLocale } from "@/actions/locale";
import type { Locale } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

/** Toggle EN/ID. Disimpan di cookie, halaman di-refresh. */
export function LocaleToggle({ current, dark = false }: { current: Locale; dark?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function pick(locale: Locale) {
    if (locale === current || busy) return;
    setBusy(true);
    await setLocale(locale);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label="Bahasa / Language"
      className={cn(
        "flex items-center rounded-full border p-1 text-xs font-extrabold",
        dark ? "border-white/25 text-white" : "border-black/15 text-ink"
      )}
    >
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={busy}
          onClick={() => pick(l)}
          aria-pressed={current === l}
          className={cn(
            "rounded-full px-3 py-1.5 uppercase tracking-widest transition",
            current === l
              ? dark
                ? "bg-white text-ink"
                : "bg-ink text-white"
              : "opacity-60 hover:opacity-100"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
