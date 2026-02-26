// NÃO usar "use client"

import WorksClient from "../components/WorksClient";
import { getAllWorks } from "../lib/cms";
import Image from "next/image";

export const dynamic = "force-static"; // gera estático no build

export default function GalleryPage() {
  // Lido no servidor via fs (SSG)
  const obras = getAllWorks();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white md:px-12 md:py-20">
      <header className="max-w-3xl w-full text-center space-y-4">
        <Image
          src="/obras.png"
          alt="Obras"
          width={500} // back to original dimensions
          height={250}
          className="max-w-[500px] w-full h-auto mx-auto" // never grow beyond natural size, center
          priority
        />
      </header>

      <WorksClient initialData={obras} />
    </main>
  );
}
