import type { NextConfig } from "next";
import path from "node:path";

// Raiz do projeto fixa: há um package-lock.json solto em C:\Users\<utilizador>
// que fazia o Next escolher a pasta errada (e falhar a carregar as fontes).
const root = path.resolve(".");

const nextConfig: NextConfig = {
  turbopack: { root },
  outputFileTracingRoot: root,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
