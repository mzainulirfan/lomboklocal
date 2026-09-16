import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { isAdmin, logout } from "../actions";
import { AdminNav, AdminLogout, AdminTabBar } from "./AdminNav";

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

      {/* Konten + topbar & tabbar mobile */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-sand/95 px-4 py-3 backdrop-blur md:hidden">
          <span className="text-sm font-extrabold tracking-tight">
            LOMBOK<span className="font-normal">LOCAL</span>
            <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              Admin
            </span>
          </span>
          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat web"
              className="rounded-full p-2.5 text-ink/60 transition active:bg-black/5"
            >
              <ExternalLink size={18} />
            </a>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Keluar"
                className="rounded-full p-2.5 text-ink/60 transition active:bg-black/5"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-8 md:pb-10 md:pt-8">
          {children}
        </main>
        <AdminTabBar />
      </div>
    </div>
  );
}
