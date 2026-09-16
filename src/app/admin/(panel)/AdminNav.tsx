"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Map,
  Van,
  Images,
  CalendarDays,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  short: string;
  icon: typeof Car;
  group: "Utama" | "Konten" | "Operasional" | "Sistem";
  primary: boolean;
};

const items: Item[] = [
  { href: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard, group: "Utama", primary: true },
  { href: "/admin/vehicles", label: "Vehicles", short: "Units", icon: Car, group: "Konten", primary: true },
  { href: "/admin/tours", label: "Tours", short: "Tours", icon: Map, group: "Konten", primary: true },
  { href: "/admin/routes", label: "Transfer", short: "Transfer", icon: Van, group: "Konten", primary: false },
  { href: "/admin/gallery", label: "Galeri", short: "Galeri", icon: Images, group: "Konten", primary: false },
  { href: "/admin/schedule", label: "Jadwal", short: "Jadwal", icon: CalendarDays, group: "Operasional", primary: true },
  { href: "/admin/inquiries", label: "Leads", short: "Leads", icon: Inbox, group: "Operasional", primary: true },
  { href: "/admin/settings", label: "Settings", short: "Setelan", icon: Settings, group: "Sistem", primary: false },
];

const groups = ["Utama", "Konten", "Operasional", "Sistem"] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-4 p-4">
      {groups.map((g) => (
        <div key={g}>
          <p className="px-4 pb-1.5 text-[11px] font-extrabold uppercase tracking-widest text-white/35">
            {g}
          </p>
          <div className="flex flex-col gap-1">
            {items
              .filter((i) => i.group === g)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                    isActive(pathname, item.href)
                      ? "bg-white text-ink"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      ))}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        <ExternalLink size={17} />
        Lihat web
      </a>
    </nav>
  );
}

/** Bottom tab bar mobile: 5 primer + sheet "Lainnya". */
export function AdminTabBar() {
  const pathname = usePathname();
  const [more, setMore] = useState(false);
  const primary = items.filter((i) => i.primary);
  const rest = items.filter((i) => !i.primary);
  const moreActive = rest.some((i) => isActive(pathname, i.href));

  return (
    <>
      <nav
        aria-label="Navigasi admin"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur md:hidden"
      >
        <div className="grid grid-cols-6 px-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5">
          {primary.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 transition",
                  active ? "bg-white text-ink" : "text-white/55 active:bg-white/10"
                )}
              >
                <item.icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                <span className="w-full truncate text-center text-[9px] font-bold leading-none">
                  {item.short}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMore(true)}
            aria-label="Menu lainnya"
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 transition",
              moreActive ? "bg-white text-ink" : "text-white/55 active:bg-white/10"
            )}
          >
            <MoreHorizontal size={20} strokeWidth={moreActive ? 2.25 : 1.75} />
            <span className="w-full truncate text-center text-[9px] font-bold leading-none">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {more && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 backdrop-blur-sm md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu admin lainnya"
          onClick={() => setMore(false)}
        >
          <div
            className="w-full rounded-t-[2rem] bg-ink p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-sm font-extrabold uppercase tracking-widest text-white/50">Lainnya</p>
              <button
                type="button"
                onClick={() => setMore(false)}
                aria-label="Tutup"
                className="rounded-full p-2 text-white/60 active:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            {rest.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMore(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold",
                    active ? "bg-white text-ink" : "text-white/70 active:bg-white/10"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-white/70 active:bg-white/10"
            >
              <ExternalLink size={18} />
              Lihat web
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function AdminLogout({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} className="p-4 pt-0">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut size={17} />
        Keluar
      </button>
    </form>
  );
}
