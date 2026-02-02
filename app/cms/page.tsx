"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CMS_CONFIG: any;
  }
}

// Substitui pelo teu Client ID do GitHub OAuth App se usares OAuth
const GITHUB_CLIENT_ID = "Ov23lieicENK5ZTrFBUm";

export default function CMSPage() {
  useEffect(() => {
    window.CMS_CONFIG = {
      load_config_file: true, // vai carregar o config.yml
      backend: {
        name: "github",
        repo: "Ildebranda/site-ildebranda",
        branch: "master",
        auth_type: "oauth",
        client_id: GITHUB_CLIENT_ID,
        auth_scope: "repo",
      },
      media_folder: "public/uploads",
      public_folder: "/uploads",
      display_url:
        "https://site-ildebranda-fm9vnyk6f-ildebranda-martins-projects.vercel.app",
    };

    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div id="nc-root" />;
}
