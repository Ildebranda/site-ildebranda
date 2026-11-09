"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";
import { mediaUrl } from "../lib/media";
import { WORK_STATUS_LABEL, type Work } from "../lib/types";

type WorkWithHtml = Work & { descriptionHtml: string };

const TILT = [-0.6, 0.5, -0.3, 0.7, -0.5, 0.3, 0.6, -0.4];

export default function WorksGallery({ works, categories }: { works: WorkWithHtml[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("");
  const [openId, setOpenId] = useState<number | null>(null);

  const visible = filter ? works.filter((w) => w.category === filter) : works;
  const openIndex = visible.findIndex((w) => w.id === openId);
  const open = openIndex >= 0 ? visible[openIndex] : null;

  // Links do tipo /obras#obra-12 (vindos da página inicial) abrem a obra
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#obra-(\d+)$/);
      if (m) setOpenId(Number(m[1]));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  }, []);

  const go = (delta: number) => {
    if (openIndex < 0) return;
    const next = visible[(openIndex + delta + visible.length) % visible.length];
    setOpenId(next.id);
  };

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-12" role="tablist" aria-label="Filtrar por categoria">
          {["", ...categories].map((c) => (
            <button
              key={c || "todas"}
              type="button"
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`font-serif text-xl transition-colors ${
                filter === c ? "text-ultra italic brush-underline" : "text-ink-soft hover:text-rose"
              }`}
            >
              {c || "Todas"}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 sm:columns-2 xl:columns-3 gap-10">
        {visible.map((w, i) => (
          <button
            key={w.id}
            id={`obra-${w.id}`}
            type="button"
            onClick={() => setOpenId(w.id)}
            className="group block w-full text-left break-inside-avoid mb-12 cursor-zoom-in"
            style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}
          >
            <div className="art-frame transition-transform duration-500 group-hover:-translate-y-1.5">
              {w.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(w.images[0], "thumb")} alt={w.title} loading="lazy" className="w-full h-auto block" />
              ) : (
                <div className="aspect-[4/5] bg-paper-2" />
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="font-serif italic text-xl text-ink group-hover:text-rose transition-colors">{w.title}</p>
              {w.status === "vendida" && (
                <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-rose">● Vendida</span>
              )}
            </div>
            {(w.year || w.technique) && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                {[w.year, w.technique].filter(Boolean).join(" · ")}
              </p>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <Lightbox
            key={open.id}
            images={open.images}
            title={open.title}
            onClose={close}
            onPrev={visible.length > 1 ? () => go(-1) : undefined}
            onNext={visible.length > 1 ? () => go(1) : undefined}
          >
            {open.category && (
              <p className="text-[11px] uppercase tracking-[0.3em] text-ochre">{open.category}</p>
            )}
            <h2 className="font-serif italic text-4xl md:text-5xl leading-tight mt-2">{open.title}</h2>
            <div className="w-12 h-[3px] bg-rose my-6 rounded-full" />

            <dl className="grid grid-cols-[6.5rem_1fr] gap-y-2 text-sm">
              {open.year && (
                <>
                  <dt className="text-paper/50 uppercase tracking-[0.15em] text-[11px] pt-0.5">Ano</dt>
                  <dd>{open.year}</dd>
                </>
              )}
              {open.technique && (
                <>
                  <dt className="text-paper/50 uppercase tracking-[0.15em] text-[11px] pt-0.5">Técnica</dt>
                  <dd>{open.technique}</dd>
                </>
              )}
              {open.dimensions && (
                <>
                  <dt className="text-paper/50 uppercase tracking-[0.15em] text-[11px] pt-0.5">Dimensões</dt>
                  <dd>{open.dimensions}</dd>
                </>
              )}
              {open.status && (
                <>
                  <dt className="text-paper/50 uppercase tracking-[0.15em] text-[11px] pt-0.5">Estado</dt>
                  <dd>{WORK_STATUS_LABEL[open.status]}</dd>
                </>
              )}
            </dl>

            {open.descriptionHtml && (
              <div
                className="prose-ilde prose-ilde-sm mt-6 !text-paper/85 [&_a]:!text-ochre"
                dangerouslySetInnerHTML={{ __html: open.descriptionHtml }}
              />
            )}

            {open.status !== "vendida" && (
              <Link
                href={`/contactos?obra=${encodeURIComponent(open.title)}`}
                className="inline-block mt-8 border border-paper/40 px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-paper hover:text-ultra-deep transition-colors"
              >
                Perguntar por esta obra
              </Link>
            )}
          </Lightbox>
        )}
      </AnimatePresence>
    </>
  );
}
