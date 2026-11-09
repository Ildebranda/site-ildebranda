import type { Metadata } from "next";
import Link from "next/link";
import { BrushTitle, EmptyState, PageShell } from "../../components/BrushTitle";
import { getPosts } from "../../lib/data";
import { formatDate } from "../../lib/format";
import { plainExcerpt } from "../../lib/markdown";
import { mediaUrl } from "../../lib/media";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Notícias" };

export default async function NoticiasPage() {
  const posts = await getPosts();

  return (
    <PageShell className="max-w-5xl">
      <BrushTitle>Notícias</BrushTitle>
      {!posts.length && <EmptyState>Ainda não há notícias.</EmptyState>}

      <div className="space-y-16">
        {posts.map((p, i) => (
          <Link
            key={p.id}
            href={`/noticias/${p.slug}`}
            className={`group grid gap-6 md:gap-10 items-center ${p.cover ? "md:grid-cols-2" : ""}`}
          >
            {p.cover && (
              <div className={`art-frame ${i % 2 ? "md:order-2 rotate-1" : "-rotate-1"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(p.cover, "thumb")}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-ink-mute">{formatDate(p.date)}</p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-ink mt-2 group-hover:text-ultra transition-colors">
                {p.title}
              </h2>
              <p className="mt-3 text-ink-soft leading-relaxed text-lg">{p.excerpt || plainExcerpt(p.body, 220)}</p>
              <span className="inline-block mt-5 text-xs uppercase tracking-[0.25em] text-rose">Ler mais →</span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
