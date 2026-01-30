import { notFound } from "next/navigation";
import { Calendar, User, Clock } from "lucide-react";
import { POSTS } from "@/app/data/posts";

// 1. ESTA É A FUNÇÃO QUE RESOLVE O ERRO DO NETLIFY
// Ela gera os parâmetros para todas as páginas de blog durante o build
export async function generateStaticParams() {
  return POSTS.map((post) => ({
    id: post.id,
  }));
}

// Definimos a interface para o TypeScript
interface PostParams {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostParams) {
  // No Next.js 15+, temos de fazer await dos params
  const { id } = await params;

  const post = POSTS.find((p) => p.id === id);

  if (!post) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-white flex flex-col items-center">
      <article className="max-w-3xl w-full">
        {/* Imagem de Destaque */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-sm">
          <img
            src={post.imagemCapa}
            className="w-full h-full object-cover"
            alt={post.titulo}
          />
        </div>

        {/* Título e Info */}
        <header className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-bold lowercase leading-tight text-zinc-900">
            {post.titulo}
          </h1>

          <div className="flex justify-center flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            <span className="flex items-center gap-2">
              <Calendar size={14} strokeWidth={1.5} /> {post.data}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} strokeWidth={1.5} /> {post.autor}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} strokeWidth={1.5} /> {post.tempoLeitura}
            </span>
          </div>
        </header>

        {/* Conteúdo do Texto */}
        <div className="prose prose-zinc lg:prose-lg mx-auto font-light leading-relaxed text-zinc-800 whitespace-pre-line">
          {post.conteudo}
        </div>
      </article>
    </main>
  );
}
