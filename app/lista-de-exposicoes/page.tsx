// NÃO usar "use client"

import ExhibitionsClient from "../components/ExhibitionsClient";
import { getAllExposicoes } from "../lib/cms";
import Image from "next/image";

export const dynamic = "force-static"; // build estático (mais rápido)

export default function ExhibitionsPage() {
  // Executa apenas no servidor (build time)
  const exposicoesDoCMS = getAllExposicoes();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-10 pb-40">
      <div className="max-w-4xl w-full text-center mb-10">
        {/* Cabeçalho decorativo */}
        <div className="relative h-32 md:h-32 w-full">
          <Image
            src="/exposicoes.png"
            alt="Exposicoes"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <ExhibitionsClient initialData={exposicoesDoCMS} />
    </main>
  );
}
