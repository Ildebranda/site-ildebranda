"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { mediaUrl } from "../lib/media";

type Props = {
  images: string[];
  title: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode; // painel de detalhes
};

/**
 * Visualizador em ecrã inteiro: imagem grande à esquerda, detalhes à direita.
 * Teclado: Esc fecha, ← → muda de obra.
 * Use `key` no componente para recomeçar na primeira imagem ao mudar de obra.
 */
export default function Lightbox({ images, title, onClose, onPrev, onNext, children }: Props) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  // Portal para o <body>: a animação de entrada da página (transform)
  // prenderia o "fixed" dentro dela, e a barra lateral ficaria por cima.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-[#16112d]/[0.96] text-paper overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[110] p-2 text-paper/80 hover:text-paper hover:rotate-90 transition-all"
        aria-label="Fechar"
      >
        <X size={30} strokeWidth={1.5} />
      </button>

      <div className="min-h-full grid lg:grid-cols-[1fr_24rem] gap-8 lg:gap-12 px-4 md:px-10 py-16 lg:py-10 items-center">
        {/* Imagem */}
        <div className="relative flex flex-col items-center justify-center">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current}
              src={mediaUrl(current)}
              alt={title}
              className="max-h-[78vh] w-auto max-w-full object-contain shadow-2xl bg-paper/5"
            />
          ) : (
            <div className="h-64" />
          )}

          {images.length > 1 && (
            <div className="flex gap-2 mt-5 flex-wrap justify-center">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-14 h-14 overflow-hidden border-2 transition ${
                    i === index ? "border-ochre" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Imagem ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(img, "thumb")} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-3 text-paper/60 hover:text-paper"
              aria-label="Anterior"
            >
              <ChevronLeft size={40} strokeWidth={1.2} />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-3 text-paper/60 hover:text-paper"
              aria-label="Seguinte"
            >
              <ChevronRight size={40} strokeWidth={1.2} />
            </button>
          )}
        </div>

        {/* Detalhes */}
        <div className="lg:max-h-[85vh] lg:overflow-y-auto pr-1">
          {children}
          {(onPrev || onNext) && (
            <div className="flex md:hidden gap-6 mt-8 text-sm uppercase tracking-[0.2em] text-paper/70">
              {onPrev && (
                <button type="button" onClick={onPrev}>
                  ← Anterior
                </button>
              )}
              {onNext && (
                <button type="button" onClick={onNext}>
                  Seguinte →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
