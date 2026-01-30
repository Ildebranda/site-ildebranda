"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WorksClient({ initialData }: { initialData: any[] }) {
  const [filtro, setFiltro] = useState("All");
  const [selectedObra, setSelectedObra] = useState<any | null>(null);

  const categorias = ["All", "Traditional", "Digital"];

  const filtradas = initialData.filter(
    (o) => filtro === "All" || o.categoria === filtro,
  );

  return (
    <>
      <header className="w-full max-w-3xl mb-16 flex flex-col items-center">
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

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl w-full mx-auto px-4">
        {filtradas.map((obra) => (
          <motion.div
            layout
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedObra(obra)}
          >
            <img
              src={obra.img}
              alt={obra.titulo}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedObra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/98 p-6 md:p-12"
          >
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setSelectedObra(null)}
            />
            <button
              onClick={() => setSelectedObra(null)}
              className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300 z-[110]"
            >
              <X size={32} />
            </button>
            <div className="relative z-10 flex flex-col md:flex-row max-w-6xl w-full gap-8 md:gap-16 items-center pointer-events-none">
              <motion.img
                src={selectedObra.img}
                className="max-h-[60vh] md:max-h-[80vh] w-auto shadow-2xl rounded-lg pointer-events-auto"
                alt={selectedObra.titulo}
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
    </>
  );
}
