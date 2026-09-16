"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Sembunyikan children di route /admin (agar tidak menutupi tab bar admin di mobile). */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
