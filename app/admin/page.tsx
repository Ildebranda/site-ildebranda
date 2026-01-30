"use client";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // Carrega o script do CMS apenas no cliente
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);

    // Adiciona o widget do Identity para o login aparecer
    const identityScript = document.createElement("script");
    identityScript.src =
      "https://identity.netlify.com/v1/netlify-identity-widget.js";
    document.head.appendChild(identityScript);
  }, []);

  return <div id="nc-root" />;
}
