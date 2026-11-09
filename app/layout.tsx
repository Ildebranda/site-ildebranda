import type { Metadata, Viewport } from "next";
import { Caveat_Brush, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// Pincel — títulos (lembra as letras pintadas à mão dos cabeçalhos antigos)
const brush = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caveat-brush",
});

// Serifa clássica — textos longos, títulos de obras
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

// Sem serifa — menus, etiquetas, backoffice
const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: {
    default: "Ildebranda Martins",
    template: "%s · Ildebranda Martins",
  },
  description:
    "Ildebranda Martins: obras, exposições e notícias.",
};

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body
        className={`${brush.variable} ${serif.variable} ${sans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
