"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EXPOSICOES } from "../data/exposicoes";

interface Expo {
  id: number;
  titulo: string;
  categoria: string;
  ano: string;
  local: string;
  img: string;
}

export default function ExhibitionsPage() {
  const [selectedExpo, setSelectedExpo] = useState<Expo | null>(null);

  const renderSection = (title: string, categoria: string) => (
    <section className="mb-24">
      {/* Subtítulo da Categoria */}
      <h2 className="font-display text-4xl md:text-5xl italic text-zinc-900 mb-12 text-center lowercase border-b border-zinc-100 pb-6">
        {title}
      </h2>

      {/* Grelha Dinâmica: Ajusta de 2 a 5 colunas dependendo do ecrã */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16 max-w-7xl mx-auto">
        {EXPOSICOES.filter((e) => e.categoria === categoria).map((expo) => (
          <motion.div
            key={expo.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col group"
          >
            {/* Contentor do Cartaz */}
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-md shadow-sm border border-zinc-100 cursor-pointer transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2"
              onClick={() => setSelectedExpo(expo)}
            >
              <img
                src={expo.img}
                alt={expo.titulo}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay suave ao passar o rato */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Legenda Estilo Currículo */}
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      {/* Título Principal */}
      <header className="">
        <img
          src="/exibithions.png"
          alt="Luana Góes Collage"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </header>

      {renderSection("Exposições Individuais", "Individual")}
      {renderSection("Exposições em Grupo", "Grupo")}

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedExpo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-white/98 p-4 md:p-12"
            onClick={() => setSelectedExpo(null)}
          >
            {/* Botão Fechar */}
            <button className="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-300 z-[130]">
              <X size={32} />
            </button>

            <div className="relative flex flex-col items-center max-w-full">
              <motion.img
                layoutId={`expo-${selectedExpo.id}`}
                src={selectedExpo.img}
                className="max-h-[80vh] w-auto shadow-2xl rounded-sm border border-zinc-100"
                alt={selectedExpo.titulo}
              />

              {/* Info no Modal */}
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
    </main>
  );
}
