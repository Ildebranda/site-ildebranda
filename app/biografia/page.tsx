"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8 md:p-24">
      <div className="max-w-3xl w-full text-center space-y-12">
        {/* Título Estilizado (Igual à imagem "About") */}
        <img
          src="/aboutme.png"
          alt="Luana Góes Collage"
          className="w-full h-full object-contain drop-shadow-xl"
        />

        {/* Imagem de Colagem Central */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Se tiveres a imagem da colagem, coloca-a aqui. 
                Usei um arredondamento orgânico para simular o efeito da foto. */}
            <img
              src="/ildebranda.jpg"
              alt="Luana Góes Collage"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </motion.div>

        {/* Texto da Biografia (Bilingue) */}
        <div className="space-y-6 text-sm md:text-base text-zinc-800 font-light leading-relaxed text-center px-4">
          <p className="opacity-80">
            Meu nome é Luana Góes, sou uma artista de mídia mista e designer do
            Brasil. Nascida em 2002, sou da região Amazônica (Amapá) e tenho uma
            irmã gêmea, Luma, que codou esse site! Quando não estou fazendo algo
            criativo, adoro tocar guitarra e assistir aos jogos de basquete da
            WNBA e NCAA. Meus artistas musicais favoritos são Little Simz e
            Warpaint.
          </p>
        </div>
      </div>
    </main>
  );
}
