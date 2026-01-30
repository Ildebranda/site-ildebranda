import type { Metadata } from "next";
import { Playfair_Display, Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Script from "next/script"; // Importante para adicionar scripts externos

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
      <head>
        {/* Script necessário para o Netlify Identity reconhecer o utilizador no login */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${sans.variable} ${serif.variable} ${display.variable} font-sans bg-white text-zinc-900 antialiased flex`}
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="flex-1 min-h-screen relative">{children}</main>
        <Footer />

        {/* Script para redirecionar o utilizador para o admin após o login bem-sucedido */}
        <Script id="netlify-identity-redirect">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
