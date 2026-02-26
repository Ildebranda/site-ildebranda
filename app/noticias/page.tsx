import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { getAllNoticias } from "../lib/cms";

export const dynamic = "force-static";

export default function BlogPage() {
  const posts = getAllNoticias();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-6 md:px-12 py-10 md:py-20">
      {/* Header imagem */}
      <div className="relative w-full max-w-3xl mb-6">
        <Image
          src="/noticias.png"
          alt="Notícias"
          width={500}                // back to original dimensions
          height={250}
          className="max-w-[500px] w-full h-auto mx-auto" // never grow beyond natural size, center
          priority
        />
      </div>

      {/* Posts */}
      <div className="max-w-3xl w-full space-y-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/noticias/${post.id}`}>
            <article className="p-8 border border-zinc-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 lowercase">
                {post.titulo}
              </h2>

              <div className="flex gap-6 text-[10px] uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(post.data).toLocaleDateString("pt-PT")}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
