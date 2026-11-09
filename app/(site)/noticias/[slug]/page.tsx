import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../../components/BrushTitle";
import { getPostBySlug, getPosts } from "../../../lib/data";
import { formatDate } from "../../../lib/format";
import { plainExcerpt, renderMarkdown } from "../../../lib/markdown";
import { mediaUrl } from "../../../lib/media";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt || plainExcerpt(post.body, 160) };
}

export default async function NoticiaPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.body);

  return (
    <PageShell className="max-w-3xl">
      <Link href="/noticias" className="text-xs uppercase tracking-[0.25em] text-ink-soft hover:text-rose">
        ← Notícias
      </Link>

      <header className="mt-8 mb-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink-mute">{formatDate(post.date)}</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] text-ultra mt-3">{post.title}</h1>
        <div className="w-14 h-[3px] bg-rose mt-6 rounded-full" />
      </header>

      {post.cover && (
        <div className="art-frame mb-12 -rotate-[0.6deg]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(post.cover)} alt="" className="w-full h-auto" />
        </div>
      )}

      <article className="prose-ilde" dangerouslySetInnerHTML={{ __html: html }} />
    </PageShell>
  );
}
