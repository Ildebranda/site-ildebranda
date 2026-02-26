"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

/* ======================================================
   TIPOS
====================================================== */

export type Work = {
  id: string;
  titulo: string;
  categoria: string;
  img: string;
  descricao: string;
};

export default function WorksClient({ initialData }: { initialData: Work[] }) {
  const [filtro, setFiltro] = useState("All");
  const [selectedObra, setSelectedObra] = useState<Work | null>(null);

  const categorias = ["All", "Instalações", "Quadros"];

  /* ======================================================
     FILTRO OTIMIZADO
  ====================================================== */

  const filtradas = useMemo(() => {
    return initialData.filter(
      (o) => filtro === "All" || o.categoria === filtro,
    );
  }, [filtro, initialData]);

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {/* ================= FILTROS ================= */}
      <header className="w-full max-w-3xl mb-8 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-6 py-1 rounded-full text-[10px] md:text-xs uppercase tracking-widest transition-all border ${
                filtro === cat
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-black border-zinc-200 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ================= GRID MASONRY ================= */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl w-full mx-auto px-4">
        {filtradas.map((obra) => (
          <motion.div
            key={obra.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedObra(obra)}
          >
            <div className="relative w-full">
              <Image
                src={obra.img}
                alt={obra.titulo}
                width={1200}
                height={1600}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedObra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm p-6 md:p-12"
          >
            {/* clique fora fecha */}
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setSelectedObra(null)}
            />

            {/* botão fechar */}
            <button
              onClick={() => setSelectedObra(null)}
              className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300 z-[110]"
            >
              <X size={32} />
            </button>

            <div className="relative z-10 flex flex-col md:flex-row max-w-6xl w-full gap-8 md:gap-16 items-center">
              <div className="relative max-h-[60vh] md:max-h-[80vh] aspect-[3/4] w-full md:w-auto">
                <Image
                  src={selectedObra.img}
                  alt={selectedObra.titulo}
                  fill
                  className="object-contain shadow-2xl rounded-lg"
                />
              </div>

              <div className="flex-1 text-left space-y-4 px-4">
                <p className="text-blue-600 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
                  {selectedObra.categoria}
                </p>

                <h2 className="font-display text-4xl md:text-6xl italic tracking-tighter text-black lowercase leading-tight">
                  {selectedObra.titulo}
                </h2>

                <div className="h-px w-12 bg-zinc-200 my-6" />

                <p className="text-zinc-600 font-light leading-relaxed max-w-md text-sm md:text-base">
                  {selectedObra.descricao}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
