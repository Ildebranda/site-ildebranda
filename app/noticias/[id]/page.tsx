import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { getAllNoticias } from "@/app/lib/cms";
import { remark } from "remark";
import html from "remark-html";

export const dynamic = "force-static";

/* =============================
   GERA PÁGINAS ESTÁTICAS
============================= */

export function generateStaticParams() {
  const posts = getAllNoticias();

  return posts.map((post) => ({
    id: post.id,
  }));
}

/* =============================
   PAGE
============================= */

interface Props {
  params: { id: string };
}

export default async function PostPage({ params }: Props) {
  const posts = getAllNoticias();
  const post = posts.find((p) => p.id === params.id);

  if (!post) return notFound();

  // markdown → html
  const processed = await remark().use(html).process(post.conteudo);
  const contentHtml = processed.toString();

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 md:px-12 bg-white flex flex-col items-center">
      <article className="max-w-3xl w-full">
        {/* Capa */}
        {post.img && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-sm">
            <Image
              src={post.img}
              alt={post.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-bold lowercase leading-tight text-zinc-900">
            {post.titulo}
          </h1>

          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-zinc-400">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.data).toLocaleDateString("pt-PT")}
            </span>
          </div>
        </header>

        {/* Markdown */}
        <div
          className="prose prose-zinc lg:prose-lg mx-auto font-light leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </main>
  );
}
