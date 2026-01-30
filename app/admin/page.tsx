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
    // 1. Script do Netlify Identity
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

    // 2. Configuração do CMS
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "git-gateway",
        branch: "master",
        site_domain: "ildebrandamartins.netlify.app", // Força o domínio para evitar fechar o popup
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url: "ildebrandamartins.netlify.app",
      collections: [
        // COLEÇÃO: OBRAS (A Galeria Masonry)
        {
          name: "obras",
          label: "Obras (Portfólio)",
          folder: "content/obras",
          create: true,
          slug: "{{slug}}",
          fields: [
            { label: "Título da Obra", name: "title", widget: "string" },
            {
              label: "Categoria",
              name: "category",
              widget: "select",
              options: ["Traditional", "Digital"],
            },
            { label: "Imagem", name: "image", widget: "image" },
            { label: "Descrição", name: "description", widget: "text" },
          ],
        },
        // COLEÇÃO: EXPOSIÇÕES
        {
          name: "exposicoes",
          label: "Exposições",
          folder: "content/exposicoes",
          create: true,
          slug: "{{slug}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            {
              label: "Categoria",
              name: "category",
              widget: "select",
              options: ["Individual", "Grupo"],
            },
            { label: "Ano", name: "year", widget: "string" },
            { label: "Local", name: "location", widget: "string" },
            { label: "Cartaz/Imagem", name: "image", widget: "image" },
            {
              label: "Texto Adicional",
              name: "body",
              widget: "markdown",
              required: false,
            },
          ],
        },
        // COLEÇÃO: NOTÍCIAS (Blog)
        {
          name: "noticias",
          label: "Notícias / Blog",
          folder: "content/blog",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Data", name: "date", widget: "datetime" },
            { label: "Imagem de Capa", name: "image", widget: "image" },
            { label: "Texto da Notícia", name: "body", widget: "markdown" },
          ],
        },
      ],
    };

    // 3. Script do Decap CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
