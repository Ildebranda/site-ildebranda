"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
    netlifyIdentity: any;
  }
}

export default function CMSPage() {
  useEffect(() => {
    // 1. Script do Netlify Identity
    const identityScript = document.createElement("script");
    identityScript.src =
      "https://identity.netlify.com/v1/netlify-identity-widget.js";
    document.head.appendChild(identityScript);

    // 2. Configuração do Decap CMS
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "git-gateway",
        branch: "master",
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url: "https://ildebrandamartins1.netlify.app",
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
          ],
        },
        {
          name: "noticias",
          label: "Notícias / Blog",
          folder: "content/blog",
          extension: "md",
          format: "frontmatter",
          create: true,
          slug: "{{slug}}",
          fields: [
            { label: "Título", name: "title", widget: "string" },
            { label: "Data", name: "date", widget: "datetime" },
            { label: "Imagem de Capa", name: "image", widget: "image" },
            {
              label: "Corpo da Notícia",
              name: "body",
              widget: "markdown",
              required: false,
            },
          ],
        },
      ],
    };

    // 3. Script do Decap CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;

    // 4. Lógica para manter o login aberto e redirecionar
    script.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", (user: any) => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/cms/";
            });
          }
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
