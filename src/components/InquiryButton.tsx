"use client";

import { useState, type ReactNode } from "react";
import { submitInquiry } from "@/actions/inquiries";
import type { InquiryInput } from "@/lib/inquiries";

/**
 * Tombol WA yang lebih dulu menyimpan lead ke DB via Server Action,
 * lalu membuka WhatsApp. Bila gagal, fallback ke href statis.
 */
export function InquiryButton({
  inquiry,
  fallbackHref,
  className,
  children,
  busyLabel = "Membuka…",
  onDone,
}: {
  inquiry: InquiryInput;
  fallbackHref: string;
  className?: string;
  children: ReactNode;
  busyLabel?: string;
  onDone?: (refCode: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const win = window.open("about:blank", "_blank");
    const go = (url: string) => {
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    };
    try {
      const { url, refCode } = await submitInquiry(inquiry);
      onDone?.(refCode);
      go(url);
    } catch {
      go(fallbackHref);
    } finally {
      setBusy(false);
    }
  }

  return (
    <a
      href={fallbackHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-disabled={busy}
      className={className}
    >
      {busy ? busyLabel : children}
    </a>
  );
}
