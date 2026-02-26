"use client";

import { Playfair_Display, Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Verifica se a página atual é a do painel de administração
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Luana Góes — artista de mídia mista. Obras, exposições e contacto." />
        <meta property="og:site_name" content="Luana Góes" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
      </head>

      <body
        className={`${sans.variable} ${serif.variable} ${display.variable} font-sans bg-white text-zinc-900 antialiased flex`}
        suppressHydrationWarning
      >
        {/* Só renderiza a Sidebar se NÃO estivermos no admin */}
        {!isAdmin && <Sidebar />}

        <main
          className={`${isAdmin ? "w-full" : "flex-1 pl-32"} min-h-screen relative`}
        >
          {children}
        </main>

        {/* Só renderiza o Footer se NÃO estivermos no admin */}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
