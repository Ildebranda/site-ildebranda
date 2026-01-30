// 1. Remove o "use client" se estiver aqui, esta página deve ser Server-Side
import WorksClient from "../components/WorksClient";
import { getAllWorks } from "../lib/cms";

export default function GalleryPage() {
  // 2. Agora o 'obras' será o array que o getAllWorks retorna
  const obras = getAllWorks();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white p-8 md:p-24">
      <header className="w-full max-w-3xl mb-16 flex flex-col items-center">
        <img
          src="/obras.png"
          alt="Obras Título"
          className="w-full h-auto object-contain drop-shadow-xl mb-10"
        />
      </header>

      {/* 3. O TypeScript já não vai reclamar porque obras é any[] */}
      <WorksClient initialData={obras} />
    </main>
  );
}

// APAGA aquela função "Function not implemented" que tinhas aqui no fundo!
