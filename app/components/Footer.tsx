"use client";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-10 left-0 right-0 flex justify-center gap-8 text-blue-500 z-50 pointer-events-auto">
      <a
        href="https://www.instagram.com/ildebrandamartins/"
        target="_blank"
        className="hover:scale-110 transition-transform duration-300"
      >
        <Instagram size={18} strokeWidth={1.5} />
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=100056384532738&locale=pt_PT"
        target="_blank"
        className="hover:scale-110 transition-transform duration-300"
      >
        <Facebook size={18} strokeWidth={1.5} />
      </a>
    </footer>
  );
}
