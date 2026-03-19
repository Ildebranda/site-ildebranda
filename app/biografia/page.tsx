"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    /* AJUSTE AQUI: Adicionei pt-10 e pb-40. 
       O pb-40 garante que o texto termine bem ANTES de chegar ao footer. */
    <main className="min-h-screen flex flex-col items-center bg-white pb-40">
      <div className="max-w-4xl w-full text-center">
        {/* Cabeçalho decorativo */}
        <div className="relative h-32 md:h-56 w-full">
          <Image
            src="/biografia.png"
            alt="Biografia"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Imagem da Ilde - Ajustada */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Foto - Usei classes padrão do Tailwind para garantir que renderiza */}
          <div className="relative w-72 h-96 md:w-80 md:h-112.5 mb-6">
            <Image
              src="/ildebranda.jpg"
              alt="Retrato de Ildebranda Martins"
              fill
              className="object-cover rounded-md shadow-2xl"
            />
          </div>
        </motion.section>

        {/* Texto da Biografia */}
        <section className="space-y-6 text-sm md:text-base text-zinc-800 font-light leading-relaxed text-center px-6 max-w-2xl mx-auto">
          <p className="opacity-90">
            Figura central na dinamização das artes contemporâneas em Portugal,
            Ildebranda Martins tem dedicado o seu percurso à construção de
            pontes entre o público e a criação artística. Com um olhar
            curatorial atento e uma sensibilidade apurada para o talento
            emergente, a sua trajetória define-se pela capacidade de humanizar
            espaços através da estética e da cultura. Mais do que uma gestora
            cultural, Ildebranda atua como uma embaixadora da criatividade,
            acreditando que a arte deve ser uma linguagem viva e acessível. Ao
            longo das últimas décadas, foi o rosto e a alma de projetos que
            deram palco a nomes consagrados e a novas vozes, promovendo um
            diálogo constante entre diferentes formas de expressão. A sua visão
            independente foca-se na autenticidade da obra e na proximidade com o
            artista, transformando cada exposição num evento de partilha. Hoje,
            continua a sua missão de inspirar através da arte, reafirmando o
            papel fundamental da cultura como o elo que une a inovação, a emoção
            e a sociedade.
          </p>
        </section>
      </div>
    </main>
  );
}
