"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
  }
}

// Substitui pelo teu Client ID do GitHub OAuth App
const GITHUB_CLIENT_ID = "Ov23lieicENK5ZTrFBUm";

export default function CMSPage() {
  useEffect(() => {
    window.CMS_CONFIG = {
      load_config_file: true, // Carrega o config.yml
      config_file_path: "/cms/config.yml", // Caminho correto do config.yml na pasta public
      backend: {
        name: "github",
        repo: "Ildebranda/site-ildebranda", // repo exato no GitHub
        branch: "master", // branch principal
        auth_type: "oauth", // obrigatório para OAuth
        client_id: GITHUB_CLIENT_ID, // OAuth Client ID
        auth_scope: "repo", // permissões
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url:
        "https://site-ildebranda-fm9vnyk6f-ildebranda-martins-projects.vercel.app",
    };

    // Carrega o script do Decap CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
