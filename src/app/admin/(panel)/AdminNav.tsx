"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Map,
  Van,
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
    <nav className="flex gap-1.5 overflow-x-auto p-3 md:flex-col md:gap-1 md:p-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
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
        className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        <ExternalLink size={17} />
        Lihat web
      </a>
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
