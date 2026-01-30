"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
    netlifyIdentity: any;
  }
}

export default function AdminPage() {
  useEffect(() => {
    // 1. Configuração do Identity ANTES do CMS
    const identityScript = document.createElement("script");
    identityScript.src =
      "https://identity.netlify.com/v1/netlify-identity-widget.js";
    identityScript.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", (user: any) => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    };
    document.head.appendChild(identityScript);

    // 2. Configuração Manual do CMS
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "git-gateway",
        branch: "main",
        // Substitui pelo teu API ID que encontras nas definições gerais do Netlify
        site_id: "ildebrandamartins.netlify.app",
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      collections: [
        {
          name: "exposicoes",
          label: "Exposições",
          folder: "content/exposicoes",
          create: true,
          extension: "md",
          format: "frontmatter",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Ano", name: "year", widget: "string" },
            { label: "Cartaz", name: "image", widget: "image" },
            { label: "Corpo", name: "body", widget: "markdown" },
          ],
        },
      ],
    };

    // 3. Carregar o CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
