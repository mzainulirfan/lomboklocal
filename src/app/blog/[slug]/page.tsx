import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { posts } from "@/content/blog";
import { getWhatsappNumber } from "@/lib/settings";
import { waGeneral } from "@/lib/whatsapp";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image], type: "article" },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const number = await getWhatsappNumber();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
  };

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="max-w-3xl pb-24">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
            <ArrowLeft size={16} /> All guides
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-ocean">
            {post.keyword} · {post.readTime} · {post.date}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
          </div>
          <article className="mt-10 space-y-8">
            {post.body.map((b, i) => (
              <div key={i}>
                {b.heading && <h2 className="text-2xl font-extrabold tracking-tight">{b.heading}</h2>}
                <p className="mt-3 leading-8 text-black/70">{b.text}</p>
              </div>
            ))}
          </article>

          {/* Internal linking — PRD §21 */}
          <div className="mt-12 grid gap-3 rounded-[2rem] bg-white p-7 text-sm sm:grid-cols-3">
            <Link href="/tours" className="font-bold hover:text-ocean">Browse tours ↗</Link>
            <Link href="/rental/scooter" className="font-bold hover:text-ocean">Rent a scooter ↗</Link>
            <Link href="/transfer" className="font-bold hover:text-ocean">Book transfer ↗</Link>
          </div>

          <div className="mt-10 text-center">
            <Button href={waGeneral(number)} variant="dark">
              Plan this with a local <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </Container>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
