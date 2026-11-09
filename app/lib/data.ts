import "server-only";
import { cache } from "react";
import { db, hasDatabase } from "./db";
import { DEFAULT_SETTINGS } from "./defaults";
import type { Exhibition, Message, Post, SiteSettings, Work } from "./types";

/*
 * Leitura de conteúdos.
 * Sem DATABASE_URL (ex.: a experimentar o design localmente) devolve
 * listas vazias e os textos por omissão, para o site abrir na mesma.
 * Com base de dados, um erro é lançado: assim o Next mantém a última
 * versão boa da página em vez de publicar uma página vazia.
 */

const WORK_COLS = `id, title, category, year, technique, dimensions, description,
  status, images::text[] as images, featured, published, position`;
const EXHIBITION_COLS = `id, title, kind, year, dates, location, description,
  images::text[] as images, link, published`;
const POST_COLS = `id, slug, title, excerpt, body, cover::text as cover,
  to_char(published_at, 'YYYY-MM-DD') as date, published`;

/* ================= DEFINIÇÕES ================= */

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasDatabase) return DEFAULT_SETTINGS;
  const rows = await db()`select value from settings where key = 'site'`;
  const saved = (rows[0]?.value ?? {}) as Partial<SiteSettings>;
  const merged = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    if (typeof saved[key] === "string") merged[key] = saved[key] as string;
  }
  return merged;
});

/* ================= OBRAS ================= */

export async function getWorks(opts: { includeDrafts?: boolean } = {}): Promise<Work[]> {
  if (!hasDatabase) return [];
  const sql = db();
  return (await sql.unsafe(
    `select ${WORK_COLS} from works
     ${opts.includeDrafts ? "" : "where published"}
     order by position asc, id desc`
  )) as unknown as Work[];
}

export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  if (!hasDatabase) return [];
  const sql = db();
  const featured = (await sql.unsafe(
    `select ${WORK_COLS} from works where published and featured
     order by position asc, id desc limit $1`,
    [limit]
  )) as unknown as Work[];
  if (featured.length) return featured;
  return (await sql.unsafe(
    `select ${WORK_COLS} from works where published
     order by position asc, id desc limit $1`,
    [limit]
  )) as unknown as Work[];
}

export async function getWork(id: number): Promise<Work | null> {
  if (!hasDatabase) return null;
  const rows = (await db().unsafe(`select ${WORK_COLS} from works where id = $1`, [
    id,
  ])) as unknown as Work[];
  return rows[0] ?? null;
}

export async function getWorkCategories(): Promise<string[]> {
  if (!hasDatabase) return [];
  const rows = await db()`
    select category, min(position) as p from works
    where category <> '' group by category order by p`;
  return rows.map((r) => r.category as string);
}

/* ================= EXPOSIÇÕES ================= */

export async function getExhibitions(
  opts: { includeDrafts?: boolean; limit?: number } = {}
): Promise<Exhibition[]> {
  if (!hasDatabase) return [];
  return (await db().unsafe(
    `select ${EXHIBITION_COLS} from exhibitions
     ${opts.includeDrafts ? "" : "where published"}
     order by year desc, id desc
     ${opts.limit ? `limit ${Math.floor(opts.limit)}` : ""}`
  )) as unknown as Exhibition[];
}

export async function getExhibition(id: number): Promise<Exhibition | null> {
  if (!hasDatabase) return null;
  const rows = (await db().unsafe(
    `select ${EXHIBITION_COLS} from exhibitions where id = $1`,
    [id]
  )) as unknown as Exhibition[];
  return rows[0] ?? null;
}

/* ================= NOTÍCIAS ================= */

export async function getPosts(
  opts: { includeDrafts?: boolean; limit?: number } = {}
): Promise<Post[]> {
  if (!hasDatabase) return [];
  return (await db().unsafe(
    `select ${POST_COLS} from posts
     ${opts.includeDrafts ? "" : "where published"}
     order by published_at desc, id desc
     ${opts.limit ? `limit ${Math.floor(opts.limit)}` : ""}`
  )) as unknown as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!hasDatabase) return null;
  const rows = (await db().unsafe(
    `select ${POST_COLS} from posts where slug = $1 and published`,
    [slug]
  )) as unknown as Post[];
  return rows[0] ?? null;
}

export async function getPost(id: number): Promise<Post | null> {
  if (!hasDatabase) return null;
  const rows = (await db().unsafe(`select ${POST_COLS} from posts where id = $1`, [
    id,
  ])) as unknown as Post[];
  return rows[0] ?? null;
}

/* ================= MENSAGENS ================= */

export async function getMessages(): Promise<Message[]> {
  if (!hasDatabase) return [];
  return (await db()`
    select id, name, email, message, read, created_at
    from messages order by created_at desc`) as unknown as Message[];
}

export async function getUnreadCount(): Promise<number> {
  if (!hasDatabase) return 0;
  const rows = await db()`select count(*)::int as n from messages where not read`;
  return rows[0]?.n ?? 0;
}

export async function getCounts() {
  if (!hasDatabase) return { works: 0, exhibitions: 0, posts: 0, unread: 0 };
  const rows = await db()`
    select
      (select count(*)::int from works) as works,
      (select count(*)::int from exhibitions) as exhibitions,
      (select count(*)::int from posts) as posts,
      (select count(*)::int from messages where not read) as unread`;
  return rows[0] as { works: number; exhibitions: number; posts: number; unread: number };
}
