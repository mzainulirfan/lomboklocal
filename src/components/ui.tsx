import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, tone = "text-ocean" }: { children: ReactNode; tone?: string }) {
  return (
    <p className={cn("mb-4 text-xs font-bold uppercase tracking-[0.25em]", tone)}>
      {children}
    </p>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "light" | "dark" | "outline-light" | "ocean";
  className?: string;
  external?: boolean;
};

export function Button({ children, href = "#", variant = "dark", className, external }: ButtonProps) {
  const styles = {
    light: "bg-white text-ink hover:bg-white/90",
    dark: "bg-ink text-white hover:bg-black",
    "outline-light":
      "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
    ocean: "bg-ocean text-white hover:brightness-110",
  } as const;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-bold transition hover:-translate-y-0.5",
        styles[variant],
        className
      )}
    >
      {children}
    </a>
  );
}
