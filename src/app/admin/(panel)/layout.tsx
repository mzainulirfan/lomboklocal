import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdmin, logout } from "../actions";
import { AdminNav, AdminLogout } from "./AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-sand text-ink">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink text-white md:flex">
        <div className="px-6 pb-2 pt-6 text-lg font-extrabold tracking-tight">
          LOMBOK<span className="font-normal">LOCAL</span>
          <span className="ml-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white/60">
            Admin
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>
        <AdminLogout action={logout} />
      </aside>

      {/* Konten + nav mobile */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-black/10 bg-sand/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 pt-3 text-sm font-extrabold tracking-tight">
            <span>
              LOMBOK<span className="font-normal">LOCAL</span> · ADMIN
            </span>
            <form action={logout}>
              <button type="submit" className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold">
                Keluar
              </button>
            </form>
          </div>
          <AdminNav />
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
