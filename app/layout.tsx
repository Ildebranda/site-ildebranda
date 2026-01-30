import type { Metadata } from "next";
import { Playfair_Display, Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

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

export const metadata: Metadata = {
  title: "Ildebranda Martins - Artista",
  description: "Pintora e Escultora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className="font-sans bg-white text-zinc-900 antialiased flex"
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="flex-1 min-h-screen relative">{children}</main>
        <Footer /> {/* O Footer agora é universal */}
      </body>
    </html>
  );
}
