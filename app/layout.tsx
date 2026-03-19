"use client";

import { Syne, Outfit, Playfair_Display } from "next/font/google"; // Importando as novas fontes
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

// Fonte para Títulos/Display (Impactante e Artística)
const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
});

// Fonte para Menus e Texto (Legível e Moderna)
const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Mantendo uma Serif clássica para textos longos/biografia, se necessário
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Ildebranda Martins — Portfólio de Arte."
        />
      </head>

      <body
        className={`${sans.variable} ${serif.variable} ${display.variable} font-sans bg-white text-zinc-900 antialiased flex`}
        suppressHydrationWarning
      >
        {!isAdmin && <Sidebar />}

        <main
          className={`${
            isAdmin ? "w-full" : "flex-1 pl-32" // pb-24 garante que o texto termina ANTES do footer
          } min-h-screen relative`}
        >
          {children}
        </main>

        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
