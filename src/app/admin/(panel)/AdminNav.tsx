"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Map,
  Van,
  Images,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/routes", label: "Transfer", icon: Van },
  { href: "/admin/gallery", label: "Galeri", icon: Images },
  { href: "/admin/inquiries", label: "Leads", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-4">
      {items.map((item) => (
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

/** Bottom tab bar khusus mobile — jempol-friendly, selalu terlihat. */
export function AdminTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi admin"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-7 px-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5">
        {items.map((item) => {
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
              <span className="w-full truncate text-center text-[10px] font-bold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
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
