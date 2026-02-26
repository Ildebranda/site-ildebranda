// NÃO usar "use client"

import ExhibitionsClient from "../components/ExhibitionsClient";
import { getAllExposicoes } from "../lib/cms";
import Image from "next/image";

export const dynamic = "force-static"; // build estático (mais rápido)

export default function ExhibitionsPage() {
  // Executa apenas no servidor (build time)
  const exposicoesDoCMS = getAllExposicoes();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-6 py-10">
      <header className="relative w-full max-w-4xl mb-10">
        <Image
          src="/exposicoes.png"
          alt="Lista de Exposições"
          width={500}                // back to original dimensions
          height={250}
          className="max-w-[500px] w-full h-auto mx-auto" // never grow beyond natural size, center
          priority
        />
      </header>

      <ExhibitionsClient initialData={exposicoesDoCMS} />
    </main>
  );
}
