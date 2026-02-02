"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
  }
}

export default function AdminPage() {
  useEffect(() => {
    window.CMS_CONFIG = {
      load_config_file: false,

      backend: {
        name: "github",
        repo: "Ildebranda/site-ildebranda",
        branch: "main",
      },

      media_folder: "public/uploads",
      public_folder: "/uploads",

      collections: [
        {
          name: "obras",
          label: "Obras",
          folder: "content/obras",
          create: true,
          slug: "{{slug}}",
          extension: "md",
          format: "frontmatter",
          fields: [
            { label: "Título", name: "title", widget: "string" },
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

        {
          name: "exposicoes",
          label: "Exposições",
          folder: "content/exposicoes",
          create: true,
          slug: "{{slug}}",
          extension: "md",
          format: "frontmatter",
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
            { label: "Imagem", name: "image", widget: "image" },
            { label: "Texto", name: "body", widget: "markdown" },
          ],
        },

        {
          name: "noticias",
          label: "Notícias",
          folder: "content/blog",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
          extension: "md",
          format: "frontmatter",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Data", name: "date", widget: "datetime" },
            { label: "Imagem", name: "image", widget: "image" },
            { label: "Conteúdo", name: "body", widget: "markdown" },
          ],
        },
      ],
    };

    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@3.3.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
