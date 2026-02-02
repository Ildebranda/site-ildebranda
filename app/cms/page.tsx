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
    // 1. Script do Netlify Identity (Obrigatório para o login funcionar)
    const identityScript = document.createElement("script");
    identityScript.src =
      "https://identity.netlify.com/v1/netlify-identity-widget.js";
    document.head.appendChild(identityScript);

    // 2. Configuração do Decap CMS para Netlify
    window.CMS_CONFIG = {
      load_config_file: false,
      backend: {
        name: "git-gateway",
        branch: "master", // A tua branch principal
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url: "https://ildebrandamartins1.netlify.app", // O teu domínio Netlify
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
        // ... (podes manter as outras coleções como tinhas)
      ],
    };

    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
