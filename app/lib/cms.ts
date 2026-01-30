import fs from "fs";
import path from "path";
import matter from "gray-matter";

const obrasDirectory = path.join(process.cwd(), "content/obras");
const exposicoesDirectory = path.join(process.cwd(), "content/exposicoes");

export function getAllWorks() {
  // 1. Verifica se a pasta existe. Se não existir, retorna logo um array vazio.
  if (!fs.existsSync(obrasDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(obrasDirectory);

  // 2. Mapeia os ficheiros
  const allWorks = fileNames.map((fileName) => {
    const fullPath = path.join(obrasDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      id: fileName.replace(/\.md$/, ""),
      titulo: data.title || "Sem título",
      categoria: data.category || "Traditional",
      img: data.image || "",
      descricao: data.description || "",
    };
  });

  return allWorks; // Garante que retorna o array preenchido
}

// Faz o mesmo para as Exposições para evitar o mesmo erro lá
export function getAllExposicoes() {
  if (!fs.existsSync(exposicoesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(exposicoesDirectory);
  const allExposicoes = fileNames.map((fileName) => {
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
  });

  return allExposicoes.sort((a, b) => (a.ano < b.ano ? 1 : -1));
}
