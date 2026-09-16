import type { MetadataRoute } from "next";
import { getTours } from "@/lib/tours";
import { posts } from "@/content/blog";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = [
    "",
    "/tours",
    "/tours/custom-trip",
    "/rental/scooter",
    "/rental/car",
    "/transfer",
    "/experiences",
    "/about",
    "/contact",
    "/faq",
    "/blog",
  ];
  const tours = await getTours();
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r || "/"}`, lastModified: new Date() })),
    ...tours.map((t) => ({
      url: `${base}/tours/${t.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
