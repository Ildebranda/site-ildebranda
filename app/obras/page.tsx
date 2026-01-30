"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { OBRAS } from "../data/obras";

// Interface para garantir a tipagem correta
interface Obra {
  id: number;
  titulo: string;
  categoria: string;
  img: string;
  descricao: string;
}

export default function GalleryPage() {
  const [filtro, setFiltro] = useState("All");
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);

  const categorias = ["All", "Traditional", "Digital"];

  const filtradas = OBRAS.filter(
    (o) => filtro === "All" || o.categoria === filtro,
  );

  return (
    <main className="min-h-screen flex flex-col items-center bg-white p-8 md:p-24">
      {/* Secção do Cabeçalho: Título + Filtros */}
      <header className="w-full max-w-3xl mb-16 flex flex-col items-center">
        {/* Título Estilizado com largura controlada */}
        <img
          src="/obras.png"
          alt="Obras Título"
          className="w-full h-auto object-contain drop-shadow-xl mb-10"
        />

        {/* Botões de Filtro */}
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

      {/* Grelha Masonry - Mais larga que o título para destacar a arte */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl w-full mx-auto px-4">
        {filtradas.map((obra: Obra) => (
          <motion.div
            layout
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedObra(obra)}
          >
            <img
              src={obra.img}
              alt={obra.titulo}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay sutil ao passar o rato */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Modal / Lightbox com Detalhes */}
      <AnimatePresence>
        {selectedObra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/98 p-6 md:p-12"
          >
            {/* Camada para fechar ao clicar fora */}
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setSelectedObra(null)}
            />

            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedObra(null)}
              className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300 z-[110]"
            >
              <X size={32} />
            </button>

            {/* Conteúdo do Modal */}
            <div className="relative z-10 flex flex-col md:flex-row max-w-6xl w-full gap-8 md:gap-16 items-center pointer-events-none">
              <motion.img
                layoutId={`img-${selectedObra.id}`}
                src={selectedObra.img}
                alt={selectedObra.titulo}
                className="max-h-[60vh] md:max-h-[80vh] w-auto shadow-2xl rounded-lg pointer-events-auto"
              />

              <div className="flex-1 text-left space-y-4 pointer-events-auto px-4">
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
    </main>
  );
}
