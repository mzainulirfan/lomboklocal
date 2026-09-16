import type { MetadataRoute } from "next";
import { tours } from "@/content/site";
import { posts } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lomboklocal.example.com";
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
