import Link from "next/link";
import { CalendarDays, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteExhibition, toggleExhibition } from "../../actions";
import { Badge, EmptyList, Flash, PageHeader } from "../../components/PageHeader";
import { ActionButton } from "../../components/ui";
import { getExhibitions } from "../../../lib/data";
import { mediaUrl } from "../../../lib/media";

const iconBtn = "p-2 rounded-lg text-ink-soft hover:bg-paper-2 hover:text-ultra";

export default async function ExposicoesAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ ok }, expos] = await Promise.all([searchParams, getExhibitions({ includeDrafts: true })]);

  return (
    <>
      <PageHeader
        title="Exposições"
        intro="Ordenadas automaticamente por ano, da mais recente para a mais antiga."
        newHref="/admin/exposicoes/nova"
        newLabel="Adicionar exposição"
      />
      <Flash ok={ok} />

      {expos.length === 0 ? (
        <EmptyList>
          Ainda não há exposições.{" "}
          <Link href="/admin/exposicoes/nova" className="text-ultra underline">
            Adicione a primeira
          </Link>
          .
        </EmptyList>
      ) : (
        <ul className="space-y-3">
          {expos.map((e) => (
            <li
              key={e.id}
              className={`flex items-center gap-4 rounded-2xl border bg-white/80 p-3 ${
                e.published ? "border-paper-3" : "border-dashed border-paper-3 opacity-70"
              }`}
            >
              <Link href={`/admin/exposicoes/${e.id}`} className="shrink-0">
                {e.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(e.images[0], "thumb")} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <span className="w-16 h-16 rounded-lg bg-paper-2 text-ink-mute flex items-center justify-center">
                    <CalendarDays size={22} />
                  </span>
                )}
              </Link>
              <Link href={`/admin/exposicoes/${e.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate text-[17px]">{e.title}</p>
                <p className="text-sm text-ink-mute truncate">
                  {[e.year, e.location].filter(Boolean).join(" · ")}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge tone="ultra">{e.kind === "individual" ? "Individual" : "Coletiva"}</Badge>
                  {!e.published && <Badge>Rascunho</Badge>}
                </div>
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                <ActionButton
                  action={toggleExhibition.bind(null, e.id)}
                  className={`${iconBtn} hidden sm:inline-flex`}
                  title={e.published ? "Esconder do site" : "Publicar no site"}
                >
                  {e.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </ActionButton>
                <Link href={`/admin/exposicoes/${e.id}`} className={iconBtn} title="Editar" aria-label="Editar">
                  <Pencil size={18} />
                </Link>
                <ActionButton
                  action={deleteExhibition.bind(null, e.id)}
                  confirmText={`Apagar a exposição "${e.title}"? Não é possível desfazer.`}
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
