import "server-only";
import { remark } from "remark";
import html from "remark-html";

/** Markdown → HTML (sanitizado). Linhas em branco separam parágrafos. */
export async function renderMarkdown(text: string): Promise<string> {
  if (!text?.trim()) return "";
  const out = await remark().use(html).process(text);
  return String(out);
}

/** Primeiras ~n letras de um texto markdown, sem formatação. */
export function plainExcerpt(text: string, n = 180): string {
  const plain = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > n ? plain.slice(0, n).replace(/\s\S*$/, "") + "…" : plain;
}
