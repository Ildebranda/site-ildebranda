"use client";
import { useEffect } from "react";

// ESTA PARTE RESOLVE O ERRO DE TYPESCRIPT:
// Declaramos que o objeto window pode ter a propriedade CMS_CONFIG
declare global {
  interface Window {
    CMS_CONFIG: any;
    netlifyIdentity: any;
  }
}

export default function AdminPage() {
  useEffect(() => {
    // 1. Configuração Manual do CMS
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "git-gateway",
        branch: "main",
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      collections: [
        {
          name: "exposicoes",
          label: "Exposições",
          folder: "content/exposicoes",
          create: true,
          slug: "{{year}}-{{title}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Ano", name: "year", widget: "string" },
            {
              label: "Categoria",
              name: "category",
              widget: "select",
              options: ["Individual", "Grupo"],
            },
            { label: "Local", name: "location", widget: "string" },
            { label: "Cartaz", name: "image", widget: "image" },
            {
              label: "Corpo do Texto",
              name: "body",
              widget: "markdown",
              required: false,
            },
          ],
        },
        {
          name: "blog",
          label: "Notícias",
          folder: "content/blog",
          create: true,
          slug: "{{slug}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Data", name: "date", widget: "datetime" },
            { label: "Capa", name: "image", widget: "image" },
            { label: "Resumo", name: "description", widget: "text" },
            { label: "Corpo", name: "body", widget: "markdown" },
          ],
        },
      ],
    };

    // 2. Adiciona o widget do Identity
    const identityScript = document.createElement("script");
    identityScript.src =
      "https://identity.netlify.com/v1/netlify-identity-widget.js";
    document.head.appendChild(identityScript);

    // 3. Carrega o script do CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
