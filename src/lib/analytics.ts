// Tiny analytics per PRD §27. Primary conversion: WhatsApp click.
// Sends to GA4 if NEXT_PUBLIC_GA_ID is set, else logs in dev.

declare global {
  interface Window {
    dataLayer?: unknown[];
    __ll_wa_bound?: boolean;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_GA_ID && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  } else if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, params);
  }
}

export const trackPageview = (path: string) => track("page_view", { path });
export const trackWaClick = (context: string, href: string) =>
  track("whatsapp_click", { context, href });
export const trackCta = (name: string) => track("cta_click", { name });
