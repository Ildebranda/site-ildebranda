// REMOVE o "use client" daqui

import ExhibitionsClient from "../components/ExhibitionsClient";
import { getAllExposicoes } from "../lib/cms";

export default function ExhibitionsPage() {
  // O servidor lê os ficheiros .md antes de mandar a página para o browser
  const exposicoesDoCMS = getAllExposicoes();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <header className="">
        <img
          src="/exibithions.png"
          alt="Exhibitions"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </header>

      {/* Passamos os dados que vieram das pastas para o componente das animações */}
      <ExhibitionsClient initialData={exposicoesDoCMS} />
    </main>
  );
}
