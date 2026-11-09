/**
 * Converte uma referência de imagem num URL.
 * - IDs (uuid) apontam para imagens guardadas na base de dados → /media/<id>
 * - Caminhos que começam por "/" ou "http" são usados tal como estão.
 */
export function mediaUrl(
  ref: string | null | undefined,
  size: "full" | "thumb" = "full",
  fallback = ""
): string {
  if (!ref) return fallback;
  if (ref.startsWith("/") || ref.startsWith("http")) return ref;
  return size === "thumb" ? `/media/${ref}?s=thumb` : `/media/${ref}`;
}

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
