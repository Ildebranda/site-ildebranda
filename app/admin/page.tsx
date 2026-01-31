"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
  }
}

export default function AdminPage() {
  useEffect(() => {
    // 1. Configuração do CMS para GitHub
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "github",
        repo: "Ildebranda/site-ildebranda", // REPO DO GITHUB
        branch: "master", // ou main, conforme o teu repo
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url: "https://ildebrandamartins.vercel.app", // URL do site Vercel
      collections: [
        {
          name: "obras",
          label: "Obras (Portfólio)",
          folder: "content/obras",
          extension: "md",
          format: "frontmatter",
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
            {
              label: "Descrição",
              name: "description",
              widget: "text",
              required: false,
            },
          ],
        },
        {
          name: "exposicoes",
          label: "Exposições",
          folder: "content/exposicoes",
          extension: "md",
          format: "frontmatter",
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
        {
          name: "noticias",
          label: "Notícias / Blog",
          folder: "content/blog",
          extension: "md",
          format: "frontmatter",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Data", name: "date", widget: "datetime" },
            { label: "Imagem de Capa", name: "image", widget: "image" },
            {
              label: "Texto da Notícia",
              name: "body",
              widget: "markdown",
              required: false,
            },
          ],
        },
      ],
    };

    // 2. Script do Decap CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
