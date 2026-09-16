"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { trackPageview, trackWaClick } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  // Global WhatsApp click tracking — covers every wa.me link (PRD §27)
  useEffect(() => {
    if (window.__ll_wa_bound) return;
    window.__ll_wa_bound = true;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href*="wa.me"]');
      if (!a) return;
      const section =
        a.closest("section")?.querySelector("h1, h2")?.textContent?.slice(0, 60) ??
        document.title;
      trackWaClick(section, (a as HTMLAnchorElement).href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script
        id="ga4"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
        }}
      />
    </>
  );
}
