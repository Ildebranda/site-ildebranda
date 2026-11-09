import { db, hasDatabase } from "@/app/lib/db";
import { UUID_RE } from "@/app/lib/media";

// Imagens guardadas na base de dados. Cada id é único e nunca muda,
// por isso o browser e a CDN do Vercel podem guardá-las "para sempre".
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase || !UUID_RE.test(id)) return new Response("Not found", { status: 404 });

  const wantThumb = new URL(req.url).searchParams.get("s") === "thumb";
  const rows = wantThumb
    ? await db()`
        select coalesce(thumb, data) as data,
               case when thumb is not null then thumb_mime else mime end as mime
        from media where id = ${id}`
    : await db()`select data, mime from media where id = ${id}`;

  const row = rows[0];
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data as Buffer), {
    headers: {
      "Content-Type": row.mime as string,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
