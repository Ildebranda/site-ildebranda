// NÃO usar "use client"

import WorksClient from "../components/WorksClient";
import { getAllWorks } from "../lib/cms";
import Image from "next/image";

export const dynamic = "force-static"; // gera estático no build

export default function GalleryPage() {
  // Lido no servidor via fs (SSG)
  const obras = getAllWorks();

  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-6 md:px-12 py-10 md:py-20">
      <header className="relative w-full max-w-3xl aspect-[3/1] mb-16">
        <Image
          src="/obras.png"
          alt="Obras"
          fill
          priority
          className="object-contain drop-shadow-xl"
        />
      </header>

      <WorksClient initialData={obras} />
    </main>
  );
}
