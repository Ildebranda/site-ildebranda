import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { deleteWork, moveWork, toggleWork } from "../../actions";
import { Badge, EmptyList, Flash, PageHeader } from "../../components/PageHeader";
import { ActionButton } from "../../components/ui";
import { getWorks } from "../../../lib/data";
import { mediaUrl } from "../../../lib/media";
import { WORK_STATUS_LABEL } from "../../../lib/types";

const iconBtn = "p-2 rounded-lg text-ink-soft hover:bg-paper-2 hover:text-ultra";

export default async function ObrasAdmin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ ok }, works] = await Promise.all([searchParams, getWorks({ includeDrafts: true })]);

  return (
    <>
      <PageHeader
        title="Obras"
        intro="A ordem desta lista é a ordem no site. Use as setas para mudar."
        newHref="/admin/obras/nova"
        newLabel="Adicionar obra"
      />
      <Flash ok={ok} />

      {works.length === 0 ? (
        <EmptyList>
          Ainda não há obras.{" "}
          <Link href="/admin/obras/nova" className="text-ultra underline">
            Adicione a primeira
          </Link>
          .
        </EmptyList>
      ) : (
        <ul className="space-y-3">
          {works.map((w, i) => (
            <li
              key={w.id}
              className={`flex items-center gap-3 md:gap-4 rounded-2xl border bg-white/80 p-3 ${
                w.published ? "border-paper-3" : "border-dashed border-paper-3 opacity-70"
              }`}
            >
              <div className="flex flex-col">
                <ActionButton action={moveWork.bind(null, w.id, -1)} className={`${iconBtn} !p-1.5`} title="Subir">
                  <ArrowUp size={16} />
                </ActionButton>
                <ActionButton action={moveWork.bind(null, w.id, 1)} className={`${iconBtn} !p-1.5`} title="Descer">
                  <ArrowDown size={16} />
                </ActionButton>
              </div>

              <Link href={`/admin/obras/${w.id}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(w.images[0], "thumb")}
                  alt=""
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover bg-paper-2"
                />
              </Link>

              <Link href={`/admin/obras/${w.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate text-[17px]">{w.title}</p>
                <p className="text-sm text-ink-mute truncate">
                  {[w.category, w.year].filter(Boolean).join(" · ") || "—"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {!w.published && <Badge>Rascunho</Badge>}
                  {w.featured && <Badge tone="ochre">Destaque</Badge>}
                  {w.status && <Badge tone={w.status === "vendida" ? "rose" : "ultra"}>{WORK_STATUS_LABEL[w.status]}</Badge>}
                </div>
              </Link>

              <div className="flex items-center gap-0.5 shrink-0">
                <ActionButton
                  action={toggleWork.bind(null, w.id, "featured")}
                  className={`${iconBtn} hidden sm:inline-flex ${w.featured ? "!text-ochre" : ""}`}
                  title={w.featured ? "Tirar do destaque" : "Pôr em destaque"}
                >
                  <Star size={18} fill={w.featured ? "currentColor" : "none"} />
                </ActionButton>
                <ActionButton
                  action={toggleWork.bind(null, w.id, "published")}
                  className={`${iconBtn} hidden sm:inline-flex`}
                  title={w.published ? "Esconder do site" : "Publicar no site"}
                >
                  {w.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </ActionButton>
                <Link href={`/admin/obras/${w.id}`} className={iconBtn} title="Editar" aria-label="Editar">
                  <Pencil size={18} />
                </Link>
                <ActionButton
                  action={deleteWork.bind(null, w.id)}
                  confirmText={`Apagar a obra "${w.title}"? Não é possível desfazer.`}
                  className={`${iconBtn} hover:!text-red-600`}
                  title="Apagar"
                >
                  <Trash2 size={18} />
                </ActionButton>
              </div>
              <span className="sr-only">Posição {i + 1}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
