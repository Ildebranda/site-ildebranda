"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Lightbox from "./Lightbox";
import { mediaUrl } from "../lib/media";
import type { Exhibition, ExhibitionKind } from "../lib/types";

type ExpoWithHtml = Exhibition & { descriptionHtml: string };

const FILTERS: { value: "" | ExhibitionKind; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "individual", label: "Individuais" },
  { value: "coletiva", label: "Coletivas" },
];

const KIND_LABEL: Record<ExhibitionKind, string> = { individual: "Individual", coletiva: "Coletiva" };

export default function ExhibitionsTimeline({ exhibitions }: { exhibitions: ExpoWithHtml[] }) {
  const [filter, setFilter] = useState<"" | ExhibitionKind>("");
  const [openId, setOpenId] = useState<number | null>(null);

  const visible = filter ? exhibitions.filter((e) => e.kind === filter) : exhibitions;
  const open = exhibitions.find((e) => e.id === openId) ?? null;

  // Agrupa por ano, mantendo a ordem (mais recente primeiro)
  const byYear: { year: string; items: ExpoWithHtml[] }[] = [];
  for (const e of visible) {
    const last = byYear[byYear.length - 1];
    if (last && last.year === e.year) last.items.push(e);
    else byYear.push({ year: e.year, items: [e] });
  }

  const hasBoth = new Set(exhibitions.map((e) => e.kind)).size > 1;

  return (
    <>
      {hasBoth && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-12" role="tablist" aria-label="Filtrar exposições">
          {FILTERS.map((f) => (
            <button
              key={f.value || "todas"}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`font-serif text-xl transition-colors ${
                filter === f.value ? "text-ultra italic brush-underline" : "text-ink-soft hover:text-rose"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-14">
        {byYear.map(({ year, items }) => (
          <section key={year || "sem-ano"} className="grid md:grid-cols-[8rem_1fr] gap-x-10 gap-y-4">
            <h2 className="font-brush text-5xl text-ochre leading-none md:sticky md:top-10 self-start">
              {year || "—"}
            </h2>
            <ul className="border-l-2 border-dashed border-paper-3 pl-6 md:pl-8 space-y-8">
              {items.map((e) => {
                const clickable = e.images.length > 0 || e.descriptionHtml;
                const content = (
                  <div className="flex gap-5 items-start">
                    {e.images[0] && (
                      <div className="art-frame !p-1.5 shrink-0 -rotate-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl(e.images[0], "thumb")}
                          alt=""
                          loading="lazy"
                          className="w-20 h-20 md:w-28 md:h-28 object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-rose">{KIND_LABEL[e.kind]}</p>
                      <h3 className="font-serif text-2xl md:text-[1.7rem] leading-tight text-ink group-hover:text-ultra transition-colors">
                        {e.title}
                      </h3>
                      <p className="mt-1 text-ink-soft">
                        {[e.location, e.dates].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[calc(1.5rem+5px)] md:-left-[calc(2rem+5px)] top-3 w-2 h-2 rounded-full bg-rose" />
                    {clickable ? (
                      <button type="button" onClick={() => setOpenId(e.id)} className="group text-left w-full cursor-pointer">
                        {content}
                      </button>
                    ) : e.link ? (
                      <a href={e.link} target="_blank" rel="noopener noreferrer" className="group block">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <Lightbox key={open.id} images={open.images} title={open.title} onClose={() => setOpenId(null)}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-ochre">
              {KIND_LABEL[open.kind]} · {open.year}
            </p>
            <h2 className="font-serif italic text-4xl md:text-5xl leading-tight mt-2">{open.title}</h2>
            <div className="w-12 h-[3px] bg-rose my-6 rounded-full" />
            <p className="text-paper/80">{[open.location, open.dates].filter(Boolean).join(" · ")}</p>
            {open.descriptionHtml && (
              <div
                className="prose-ilde prose-ilde-sm mt-6 !text-paper/85 [&_a]:!text-ochre"
                dangerouslySetInnerHTML={{ __html: open.descriptionHtml }}
              />
            )}
            {open.link && (
              <a
                href={open.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 border border-paper/40 px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-paper hover:text-ultra-deep transition-colors"
              >
                Saber mais <ExternalLink size={14} />
              </a>
            )}
          </Lightbox>
        )}
      </AnimatePresence>
    </>
  );
}
