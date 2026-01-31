"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

/* ======================================================
   TIPOS
====================================================== */

export type Exposicao = {
  id: string;
  titulo: string;
  categoria: string;
  ano: string | number;
  local: string;
  img: string;
};

export default function ExhibitionsClient({
  initialData,
}: {
  initialData: Exposicao[];
}) {
  const [selectedExpo, setSelectedExpo] = useState<Exposicao | null>(null);

  /* ======================================================
     GRID SECTIONS
  ====================================================== */

  const renderSection = (title: string, categoria: string) => {
    const items = initialData.filter((e) => e.categoria === categoria);

    if (!items.length) return null;

    return (
      <section className="mb-24 w-full">
        <h2 className="font-display text-4xl md:text-5xl italic text-zinc-900 mb-12 text-center lowercase border-b border-zinc-100 pb-6">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16 max-w-7xl mx-auto">
          {items.map((expo) => (
            <motion.div
              key={expo.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col group cursor-pointer"
              onClick={() => setSelectedExpo(expo)}
            >
              {/* Imagem */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-md shadow-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <Image
                  src={expo.img}
                  alt={expo.titulo}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Texto */}
              <div className="mt-5 space-y-1">
                <h3 className="font-display text-xl italic text-zinc-900 lowercase leading-none">
                  {expo.titulo}
                </h3>

                <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                  {expo.ano}
                </p>

                <p className="text-[11px] text-zinc-400 font-light leading-tight">
                  {expo.local}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {renderSection("Exposições Individuais", "Individual")}
      {renderSection("Exposições em Grupo", "Grupo")}

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedExpo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-white/95 backdrop-blur-sm p-6 md:p-12"
            onClick={() => setSelectedExpo(null)}
          >
            {/* botão fechar */}
            <button
              onClick={() => setSelectedExpo(null)}
              className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300 z-[130]"
            >
              <X size={32} />
            </button>

            <div
              className="relative flex flex-col items-center max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[80vh] aspect-[3/4]">
                <Image
                  src={selectedExpo.img}
                  alt={selectedExpo.titulo}
                  fill
                  className="object-contain shadow-2xl rounded-sm border border-zinc-100"
                />
              </div>

              <div className="mt-6 text-center">
                <h4 className="font-display text-3xl italic text-black lowercase">
                  {selectedExpo.titulo}
                </h4>

                <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">
                  {selectedExpo.local} — {selectedExpo.ano}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
