/** Base URL publik — set NEXT_PUBLIC_SITE_URL di env/Vercel saat launch. */
export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://lomboklocal.example.com";
}
