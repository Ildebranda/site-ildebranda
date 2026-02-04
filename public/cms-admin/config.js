window.CMS_MANUAL_INIT = true;

window.CMS_CONFIG = {
  backend: {
    name: "github",
    repo: "Ildebranda/site-ildebranda",
    branch: "master",
    base_url: "https://decap-cms-oauth-gh.vercel.app",
    auth_endpoint: "auth",
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
      format: "frontmatter",
      fields: [
        { label: "ID", name: "id", widget: "string" },
        { label: "Título", name: "titulo", widget: "string" },
        { label: "Categoria", name: "categoria", widget: "select", options: ["Traditional", "Digital"] },
        { label: "Imagem", name: "img", widget: "image" },
        { label: "Descrição", name: "descricao", widget: "markdown" },
      ],
    },
    {
      name: "noticias",
      label: "Notícias",
      folder: "content/blog",
      create: true,
      slug: "{{slug}}",
      fields: [
        { label: "Título", name: "title", widget: "string" },
        { label: "Data", name: "date", widget: "datetime" },
        { label: "Conteúdo", name: "body", widget: "markdown" },
      ],
    },
    {
      name: "exposicoes",
      label: "Exposições",
      folder: "content/exposicoes",
      create: true,
      slug: "{{slug}}",
      fields: [
        { label: "Título", name: "title", widget: "string" },
        { label: "Data", name: "date", widget: "datetime" },
        { label: "Local", name: "location", widget: "string" },
        { label: "Descrição", name: "body", widget: "markdown" },
      ],
    },
  ],
};

CMS.init();
