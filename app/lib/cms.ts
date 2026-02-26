import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ======================================================
   HELPER GENÉRICO
   Lê qualquer pasta de markdown e devolve frontmatter + content
====================================================== */

function getCollection(folderPath: string) {
  const directory = path.join(process.cwd(), folderPath);

  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".md")) // ignora .gitkeep e outros ficheiros
    .map((fileName) => {
      const fullPath = path.join(directory, fileName);
      const source = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(source);

      return {
        slug: fileName.replace(/\.md$/, ""),
        data,
        content,
      };
    });
}

/* ======================================================
   OBRAS
====================================================== */

export function getAllWorks() {
  const works = getCollection("content/obras");

  return works.map(({ slug, data }) => ({
    id: slug,
    titulo: data.title || "Sem título",
    categoria: data.category || "Instalações",
    img: data.image || "",
    descricao: data.description || "",
  }));
}

/* ======================================================
   EXPOSIÇÕES
====================================================== */

export function getAllExposicoes() {
  const exposicoes = getCollection("content/exposicoes");

  return exposicoes
    .map(({ slug, data }) => ({
      id: slug,
      titulo: data.title || "",
      categoria: data.category || "",
      ano: data.year || "",
      local: data.location || "",
      img: data.image || "",
    }))
    .sort((a, b) => Number(b.ano) - Number(a.ano)); // mais recente primeiro
}

/* ======================================================
   NOTÍCIAS / BLOG
====================================================== */

export function getAllNoticias() {
  const noticias = getCollection("content/blog");

  return noticias
    .map(({ slug, data, content }) => ({
      id: slug,
      titulo: data.title || "",
      data: data.date || "",
      img: data.image || "",
      conteudo: content || "",
    }))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()); // mais recente primeiro
}
