// NÃO usar "use client"

import WorksClient from "../components/WorksClient";
import { getAllWorks } from "../lib/cms";
import Image from "next/image";

export const dynamic = "force-static"; // gera estático no build

export default function GalleryPage() {
  // Lido no servidor via fs (SSG)
  const obras = getAllWorks();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-10 pb-40">
      <div className="max-w-4xl w-full text-center">
        {/* Cabeçalho decorativo */}
        <div className="relative h-32 md:h-32 w-full">
          <Image
            src="/obras.png"
            alt="Obras"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <WorksClient initialData={obras} />
    </main>
  );
}
