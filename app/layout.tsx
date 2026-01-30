"use client";

import { Playfair_Display, Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Script from "next/script";
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
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${sans.variable} ${serif.variable} ${display.variable} font-sans bg-white text-zinc-900 antialiased flex`}
        suppressHydrationWarning
      >
        {/* Só renderiza a Sidebar se NÃO estivermos no admin */}
        {!isAdmin && <Sidebar />}

        <main
          className={`${isAdmin ? "w-full" : "flex-1"} min-h-screen relative`}
        >
          {children}
        </main>

        {/* Só renderiza o Footer se NÃO estivermos no admin */}
        {!isAdmin && <Footer />}

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
