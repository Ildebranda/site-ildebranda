import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { POSTS } from "../data/posts";

export default function BlogPage() {
  return (
    // Removi o 'justify-center' para o conteúdo começar do topo
    <main className="min-h-screen flex flex-col items-center bg-white p-8 md:p-24">
      {/* Contentor do Título:
        - Usei 'max-w-3xl' (igual ao da página About) para garantir que ele cresce
          bastante, mas não ultrapassa a largura do conteúdo principal.
        - 'w-full' para ocupar esse espaço de 3xl.
      */}
      <div className="w-full max-w-3xl mb-12">
        <img
          src="/blog.png" // Lembre-se: em Next.js, não use /public no caminho
          alt="Blog Título"
          // 'h-auto' é importante para manter a proporção correta ao esticar a largura
          className="w-full h-auto object-contain drop-shadow-xl"
        />
      </div>

      {/* Contentor dos Posts (mantém o mesmo max-w-3xl) */}
      <div className="max-w-3xl w-full space-y-6">
        {POSTS.map((post) => (
          <Link key={post.id} href={`/noticias/${post.id}`}>
            <article className="p-8 border border-zinc-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 lowercase">
                {post.titulo}
              </h2>
              <p className="text-zinc-500 mb-6 font-light">{post.subtitulo}</p>

              <div className="flex gap-6 text-[10px] uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2">
                  <Calendar size={14} /> {post.data}
                </span>
                <span className="flex items-center gap-2">
                  <User size={14} /> {post.autor}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
