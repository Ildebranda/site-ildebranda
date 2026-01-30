"use client"; // Obrigatório porque o Framer Motion usa hooks do React

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Começa invisível e um pouco abaixo
      animate={{ opacity: 1, y: 0 }} // Fica visível e na posição correta
      transition={{
        ease: "easeInOut",
        duration: 0.75, // Duração de quase 1 segundo para ser suave
      }}
    >
      {children}
    </motion.div>
  );
}
