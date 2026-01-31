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
      <header className="relative w-full max-w-4xl aspect-[3/1] mb-20">
        <Image
          src="/exibithions.png"
          alt="Exhibitions"
          fill
          priority
          className="object-contain drop-shadow-xl"
        />
      </header>

      <ExhibitionsClient initialData={exposicoesDoCMS} />
    </main>
  );
}
