import { NextResponse } from "next/server";
import { getAdmin } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

const MAX_BYTES = 4 * 1024 * 1024; // limite do Vercel ≈ 4,5 MB por pedido

// Recebe uma imagem já redimensionada pelo browser (+ miniatura) e guarda-a.
export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const thumb = form.get("thumb");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Ficheiro inválido." }, { status: 400 });
  }
  const total = file.size + (thumb instanceof File ? thumb.size : 0);
  if (total > MAX_BYTES) {
    return NextResponse.json({ error: "Imagem demasiado grande." }, { status: 413 });
  }

  const width = Number(form.get("width")) || null;
  const height = Number(form.get("height")) || null;
  const data = Buffer.from(await file.arrayBuffer());
  const thumbData = thumb instanceof File ? Buffer.from(await thumb.arrayBuffer()) : null;

  const [row] = await db()`
    insert into media (filename, mime, width, height, data, thumb, thumb_mime)
    values (${String(form.get("filename") ?? file.name).slice(0, 200)}, ${file.type},
            ${width}, ${height}, ${data}, ${thumbData},
            ${thumb instanceof File ? thumb.type : null})
    returning id`;

  return NextResponse.json({ id: row.id });
}
