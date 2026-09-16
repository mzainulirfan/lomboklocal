import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { posts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Lombok travel guides: scooter rental prices, south Lombok itineraries, airport transfers and private tours.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>Blog</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Lombok, explained.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Practical guides written by locals — prices, routes and honest tips.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ocean">
                  {p.keyword} · {p.readTime}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{p.title}</h2>
                <p className="mt-2 text-sm leading-6 text-black/55">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                  Read <ArrowUpRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
