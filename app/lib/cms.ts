import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Caminhos das pastas
const exposicoesDirectory = path.join(process.cwd(), "content/exposicoes");
const obrasDirectory = path.join(process.cwd(), "content/obras");
const postsDirectory = path.join(process.cwd(), "content/blog");

// LEITOR DE EXPOSIÇÕES
export function getAllExposicoes() {
  if (!fs.existsSync(exposicoesDirectory)) return [];
  const fileNames = fs.readdirSync(exposicoesDirectory);
  return fileNames
    .map((fileName) => {
      const fileContents = fs.readFileSync(
        path.join(exposicoesDirectory, fileName),
        "utf8",
      );
      const { data } = matter(fileContents);
      return {
        id: fileName.replace(/\.md$/, ""),
        titulo: data.title,
        categoria: data.category,
        ano: data.year,
        local: data.location,
        img: data.image,
      };
    })
    .sort((a, b) => (a.ano < b.ano ? 1 : -1));
}

// LEITOR DE OBRAS (PORTFÓLIO)
export function getAllWorks() {
  if (!fs.existsSync(obrasDirectory)) return [];
  const fileNames = fs.readdirSync(obrasDirectory);
  return fileNames.map((fileName) => {
    const fileContents = fs.readFileSync(
      path.join(obrasDirectory, fileName),
      "utf8",
    );
    const { data } = matter(fileContents);
    return {
      id: fileName.replace(/\.md$/, ""),
      titulo: data.title,
      categoria: data.category, // Traditional ou Digital
      img: data.image,
      descricao: data.description || "",
    };
  });
}

// LEITOR DE NOTÍCIAS (BLOG)
export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .map((fileName) => {
      const fileContents = fs.readFileSync(
        path.join(postsDirectory, fileName),
        "utf8",
      );
      const { data } = matter(fileContents);
      return {
        id: fileName.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        image: data.image,
        content: data.body,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
