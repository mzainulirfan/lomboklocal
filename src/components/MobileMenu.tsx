"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/tours", label: "Tours" },
  { href: "/rental/scooter", label: "Scooter rental" },
  { href: "/rental/car", label: "Car rental" },
  { href: "/experiences", label: "Experiences" },
  { href: "/transfer", label: "Transfer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

/** Hamburger + drawer navigasi mobile. */
export function MobileMenu({ dark = true, bookHref }: { dark?: boolean; bookHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka menu"
        aria-expanded={open}
        className={cn(
          "rounded-full p-2.5 transition active:bg-black/10",
          dark ? "text-white" : "text-ink"
        )}
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink text-white" role="dialog" aria-modal="true" aria-label="Menu navigasi">
          <div className="flex items-center justify-between px-5 py-5">
            <span className="text-lg font-extrabold tracking-tight">
              LOMBOK<span className="font-normal">LOCAL</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="rounded-full p-2.5 transition active:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-4 text-2xl font-extrabold tracking-tight transition active:text-white/70"
              >
                {l.label}
                <span className="text-sm font-bold text-white/30">0{i + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <a
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-ink"
            >
              Book a Trip <ArrowUpRight size={16} className="ml-2" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
