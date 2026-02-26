"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8 md:p-24">
      <div className="max-w-3xl w-full text-center space-y-4">

        {/* Título Estilizado (imagem decorativa; título real no DOM acima) */}
        <Image
          src="/biografia.png"
          alt="Biografia"
          width={500}                // back to original dimensions
          height={250}
          className="max-w-[500px] w-full h-auto mx-auto" // never grow beyond natural size, center
          priority
        />

        {/* Imagem de Colagem Central */}
        <motion.section
          aria-labelledby="bio-collage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image
              src="/ildebranda.jpg"
              alt="Retrato de Luana Góes, colagem de média mista"
              fill
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover rounded-md drop-shadow-xl"
            />
          </div>
        </motion.section>

        {/* Texto da Biografia (Bilingue) */}
        <section id="bio-collage" className="space-y-6 text-sm md:text-base text-zinc-800 font-light leading-relaxed text-center px-4">
          <p className="opacity-80">
            Meu nome é Luana Góes, sou uma artista de mídia mista e designer do
            Brasil. Nascida em 2002, sou da região Amazônica (Amapá) e tenho uma
            irmã gêmea, Luma, que codou esse site! Quando não estou fazendo algo
            criativo, adoro tocar guitarra e assistir aos jogos de basquete da
            WNBA e NCAA. Meus artistas musicais favoritos são Little Simz e
            Warpaint.
          </p>
        </section>
      </div>
    </main>
  );
}
