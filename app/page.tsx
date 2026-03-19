"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 md:p-16">
      {/* Container Principal:
        Mantemos o aspect-ratio mas removemos qualquer overflow ou arredondamento 
        que possa cortar a borda irregular da imagem.
      */}
      <div className="relative w-full flex items-center justify-center">
        {/* 1. Imagem Central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          /* O segredo aqui é o max-w-[95vw] para garantir que ela use quase toda a largura */
          className="relative w-full flex items-center justify-center mx-auto"
        >
          <img
            src="/fundo.png"
            alt="Ildebranda Martins"
            /* Ajuste crucial:
      - w-full: Mantém a largura que desejas.
      - max-h-[60vh]: Limita a altura a 60% da janela (ajusta para 50vh se quiseres ainda mais curta).
      - object-contain: Garante que o recorte irregular não seja cortado.
    */
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* 2. Conteúdo de Texto (Opcional) */}
        {/* Se a tua imagem já tem o nome "Ildebranda Martins" desenhado, 
          podes deixar este bloco vazio ou removê-lo. 
        */}
        <div className="absolute z-10 text-center pointer-events-none">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* O texto apareceria aqui se necessário */}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
