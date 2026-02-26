"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6 md:p-16">
      {/* Container Principal:
        Mantemos o aspect-ratio mas removemos qualquer overflow ou arredondamento 
        que possa cortar a borda irregular da imagem.
      */}
      <div className="relative w-full  flex items-center justify-center">
        {/* 1. Imagem Central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* IMPORTANTE: 
            Para este efeito funcionar, a imagem deve ser um PNG com fundo transparente.
            - Removido: 'rounded', 'overflow-hidden' e 'shadow-2xl' (que criam o retângulo).
            - Adicionado: 'drop-shadow-2xl' diretamente na tag img para a sombra seguir a borda da arte.
            - 'object-contain': Garante que a borda irregular não seja cortada.
          */}
          <img
            src="/logo.png"
            alt="Ildebranda Martins"
            className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
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
