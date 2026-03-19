"use client";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    // Mudanças: bg-white (ou a cor de fundo do site), w-full, e h-20 para dar altura
    <footer className="fixed bottom-0 left-0 right-0 bg-white h-20 flex items-center justify-center gap-8 text-blue-500 z-50">
      {/* O container interno pode ter um padding-left para compensar a sidebar se necessário */}
      <div className="flex gap-8 ml-32">
        <a
          href="https://www.instagram.com/ildebrandamartins/"
          target="_blank"
          className="hover:scale-110 transition-transform duration-300"
        >
          <Instagram size={18} strokeWidth={1.5} />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100056384532738"
          target="_blank"
          className="hover:scale-110 transition-transform duration-300"
        >
          <Facebook size={18} strokeWidth={1.5} />
        </a>
      </div>
    </footer>
  );
}
