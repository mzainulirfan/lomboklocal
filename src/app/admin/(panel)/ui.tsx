import type { ReactNode } from "react";
import Link from "next/link";

/** Input standar panel admin. */
export const input =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-black/30";

export const label =
  "text-xs font-bold uppercase tracking-widest text-black/40";

export function PanelHeader({
  kicker,
  title,
  desc,
  action,
}: {
  kicker: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-ocean">{kicker}</p>
        <h1 className="display text-4xl font-extrabold uppercase sm:text-5xl">{title}</h1>
        {desc && <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-3xl bg-white p-8 text-center text-sm text-black/50">{children}</p>
  );
}

export function ViewLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="mt-8 text-sm text-black/50">
      Perubahan langsung tampil di{" "}
      <Link href={href} className="font-bold text-ink underline">
        {children}
      </Link>
      .
    </p>
  );
}
