"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Input password dengan ikon mata show/hide. */
export function PasswordInput({ className }: { className?: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative mt-2">
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        className={className}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        aria-pressed={show}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-black/40 transition hover:bg-black/5 hover:text-ink"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
