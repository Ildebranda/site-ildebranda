import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Newspaper, Pencil, Trash2 } from "lucide-react";
import { deletePost, togglePost } from "../../actions";
import { Badge, EmptyList, Flash, PageHeader } from "../../components/PageHeader";
import { ActionButton } from "../../components/ui";
import { getPosts } from "../../../lib/data";
import { formatDate } from "../../../lib/format";
import { mediaUrl } from "../../../lib/media";

const iconBtn = "p-2 rounded-lg text-ink-soft hover:bg-paper-2 hover:text-ultra";

export default async function NoticiasAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ ok }, posts] = await Promise.all([searchParams, getPosts({ includeDrafts: true })]);

  return (
    <>
      <PageHeader title="Notícias" newHref="/admin/noticias/nova" newLabel="Escrever notícia" />
      <Flash ok={ok} />

      {posts.length === 0 ? (
        <EmptyList>
          Ainda não há notícias.{" "}
          <Link href="/admin/noticias/nova" className="text-ultra underline">
            Escreva a primeira
          </Link>
          .
        </EmptyList>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-4 rounded-2xl border bg-white/80 p-3 ${
                p.published ? "border-paper-3" : "border-dashed border-paper-3 opacity-70"
              }`}
            >
              <Link href={`/admin/noticias/${p.id}`} className="shrink-0">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(p.cover, "thumb")} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <span className="w-16 h-16 rounded-lg bg-paper-2 text-ink-mute flex items-center justify-center">
                    <Newspaper size={22} />
                  </span>
                )}
              </Link>
              <Link href={`/admin/noticias/${p.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate text-[17px]">{p.title}</p>
                <p className="text-sm text-ink-mute">{formatDate(p.date)}</p>
                {!p.published && (
                  <div className="mt-1">
                    <Badge>Rascunho</Badge>
                  </div>
                )}
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                {p.published && (
                  <a href={`/noticias/${p.slug}`} target="_blank" className={`${iconBtn} hidden sm:inline-flex`} title="Ver no site" aria-label="Ver no site">
                    <ExternalLink size={18} />
                  </a>
                )}
                <ActionButton
                  action={togglePost.bind(null, p.id)}
                  className={`${iconBtn} hidden sm:inline-flex`}
                  title={p.published ? "Esconder do site" : "Publicar no site"}
                >
                  {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </ActionButton>
                <Link href={`/admin/noticias/${p.id}`} className={iconBtn} title="Editar" aria-label="Editar">
                  <Pencil size={18} />
                </Link>
                <ActionButton
                  action={deletePost.bind(null, p.id)}
                  confirmText={`Apagar a notícia "${p.title}"? Não é possível desfazer.`}
                  className={`${iconBtn} hover:!text-red-600`}
                  title="Apagar"
                >
                  <Trash2 size={18} />
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
