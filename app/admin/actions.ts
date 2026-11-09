"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "../lib/auth";
import { db, hasDatabase } from "../lib/db";
import { DEFAULT_SETTINGS } from "../lib/defaults";
import { UUID_RE } from "../lib/media";
import type { SiteSettings } from "../lib/types";

export type FormState = { error?: string; ok?: string };

/* ======================================================
   AJUDANTES
====================================================== */

function str(form: FormData, key: string, max = 500): string {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function bool(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true";
}

function imageIds(form: FormData, key: string): string[] {
  return form
    .getAll(key)
    .map(String)
    .filter((id) => UUID_RE.test(id))
    .slice(0, 30);
}

/** Atualiza o site público e apaga imagens que já não são usadas. */
async function publish() {
  revalidatePath("/", "layout");
  try {
    // Margem de 1 dia: protege imagens acabadas de carregar num formulário ainda por gravar
    await db()`
      delete from media m
      where m.created_at < now() - interval '1 day'
        and not exists (select 1 from works w where m.id = any(w.images))
        and not exists (select 1 from exhibitions e where m.id = any(e.images))
        and not exists (select 1 from posts p where p.cover = m.id)
        and not exists (select 1 from settings s where s.value::text like '%' || m.id::text || '%')`;
  } catch (err) {
    console.error("Limpeza de imagens falhou", err);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ======================================================
   ENTRAR / SAIR
====================================================== */

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!hasDatabase) return { error: "A base de dados ainda não está configurada (DATABASE_URL)." };
  const email = str(form, "email", 200).toLowerCase();
  const password = String(form.get("password") ?? "");

  const rows = await db()`select id, password_hash from admin_users where email = ${email}`;
  const user = rows[0];
  if (!user || !verifyPassword(password, user.passwordHash)) {
    await sleep(700); // trava tentativas em série
    return { error: "Email ou palavra-passe incorretos." };
  }
  await createSession(user.id, user.passwordHash);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/entrar");
}

/* ======================================================
   OBRAS
====================================================== */

export async function saveWork(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id")) || null;
  const w = {
    title: str(form, "title", 200),
    category: str(form, "category", 80),
    year: str(form, "year", 20),
    technique: str(form, "technique", 200),
    dimensions: str(form, "dimensions", 100),
    description: str(form, "description", 20000),
    status: ["disponivel", "vendida", "colecao"].includes(str(form, "status")) ? str(form, "status") : "",
    images: imageIds(form, "images"),
    featured: bool(form, "featured"),
    published: bool(form, "published"),
  };
  if (!w.title) return { error: "Dê um título à obra." };
  if (!w.images.length) return { error: "Adicione pelo menos uma fotografia da obra." };

  const sql = db();
  if (id) {
    await sql`
      update works set title = ${w.title}, category = ${w.category}, year = ${w.year},
        technique = ${w.technique}, dimensions = ${w.dimensions}, description = ${w.description},
        status = ${w.status}, images = ${w.images}::uuid[], featured = ${w.featured},
        published = ${w.published}, updated_at = now()
      where id = ${id}`;
  } else {
    // Obras novas aparecem em primeiro lugar
    await sql`
      insert into works (title, category, year, technique, dimensions, description, status,
                         images, featured, published, position)
      values (${w.title}, ${w.category}, ${w.year}, ${w.technique}, ${w.dimensions},
              ${w.description}, ${w.status}, ${w.images}::uuid[], ${w.featured}, ${w.published},
              (select coalesce(min(position), 0) - 1 from works))`;
  }
  await publish();
  redirect(`/admin/obras?ok=${id ? "editada" : "criada"}`);
}

export async function deleteWork(id: number) {
  await requireAdmin();
  await db()`delete from works where id = ${id}`;
  await publish();
  redirect("/admin/obras?ok=apagada");
}

export async function moveWork(id: number, direction: -1 | 1) {
  await requireAdmin();
  const sql = db();
  const ids = (await sql`select id from works order by position asc, id desc`).map((r) => r.id as number);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const positions = ids.map((_, k) => k);
  await sql`
    update works w set position = d.pos
    from unnest(${ids}::int[], ${positions}::int[]) as d(id, pos)
    where w.id = d.id`;
  revalidatePath("/", "layout");
}

export async function toggleWork(id: number, field: "published" | "featured") {
  await requireAdmin();
  if (field === "published") await db()`update works set published = not published where id = ${id}`;
  else await db()`update works set featured = not featured where id = ${id}`;
  revalidatePath("/", "layout");
}

/* ======================================================
   EXPOSIÇÕES
====================================================== */

export async function saveExhibition(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id")) || null;
  const link = str(form, "link", 500);
  const e = {
    title: str(form, "title", 200),
    kind: str(form, "kind") === "coletiva" ? "coletiva" : "individual",
    year: str(form, "year", 10),
    dates: str(form, "dates", 120),
    location: str(form, "location", 200),
    description: str(form, "description", 20000),
    images: imageIds(form, "images"),
    link: link && !/^https?:\/\//i.test(link) ? `https://${link}` : link,
    published: bool(form, "published"),
  };
  if (!e.title) return { error: "Dê um título à exposição." };
  if (!/^\d{4}$/.test(e.year)) return { error: "Indique o ano com 4 algarismos (ex.: 2025)." };

  const sql = db();
  if (id) {
    await sql`
      update exhibitions set title = ${e.title}, kind = ${e.kind}, year = ${e.year},
        dates = ${e.dates}, location = ${e.location}, description = ${e.description},
        images = ${e.images}::uuid[], link = ${e.link}, published = ${e.published},
        updated_at = now()
      where id = ${id}`;
  } else {
    await sql`
      insert into exhibitions (title, kind, year, dates, location, description, images, link, published)
      values (${e.title}, ${e.kind}, ${e.year}, ${e.dates}, ${e.location}, ${e.description},
              ${e.images}::uuid[], ${e.link}, ${e.published})`;
  }
  await publish();
  redirect(`/admin/exposicoes?ok=${id ? "editada" : "criada"}`);
}

export async function deleteExhibition(id: number) {
  await requireAdmin();
  await db()`delete from exhibitions where id = ${id}`;
  await publish();
  redirect("/admin/exposicoes?ok=apagada");
}

export async function toggleExhibition(id: number) {
  await requireAdmin();
  await db()`update exhibitions set published = not published where id = ${id}`;
  revalidatePath("/", "layout");
}

/* ======================================================
   NOTÍCIAS
====================================================== */

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "noticia"
  );
}

export async function savePost(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id")) || null;
  const cover = imageIds(form, "cover")[0] ?? null;
  const p = {
    title: str(form, "title", 200),
    excerpt: str(form, "excerpt", 400),
    body: str(form, "body", 50000),
    date: str(form, "date", 10),
    published: bool(form, "published"),
  };
  if (!p.title) return { error: "Dê um título à notícia." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return { error: "Escolha a data da notícia." };

  const sql = db();
  if (id) {
    await sql`
      update posts set title = ${p.title}, excerpt = ${p.excerpt}, body = ${p.body},
        cover = ${cover}, published_at = ${p.date}, published = ${p.published}, updated_at = now()
      where id = ${id}`;
  } else {
    const base = slugify(p.title);
    const taken = new Set(
      (await sql`select slug from posts where slug = ${base} or slug like ${base + "-%"}`).map(
        (r) => r.slug as string
      )
    );
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    await sql`
      insert into posts (slug, title, excerpt, body, cover, published_at, published)
      values (${slug}, ${p.title}, ${p.excerpt}, ${p.body}, ${cover}, ${p.date}, ${p.published})`;
  }
  await publish();
  redirect(`/admin/noticias?ok=${id ? "editada" : "criada"}`);
}

export async function deletePost(id: number) {
  await requireAdmin();
  await db()`delete from posts where id = ${id}`;
  await publish();
  redirect("/admin/noticias?ok=apagada");
}

export async function togglePost(id: number) {
  await requireAdmin();
  await db()`update posts set published = not published where id = ${id}`;
  revalidatePath("/", "layout");
}

/* ======================================================
   MENSAGENS
====================================================== */

export async function setMessageRead(id: number, read: boolean) {
  await requireAdmin();
  await db()`update messages set read = ${read} where id = ${id}`;
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await db()`delete from messages where id = ${id}`;
  revalidatePath("/admin", "layout");
}

/* ======================================================
   PÁGINAS (textos e imagens fixas)
====================================================== */

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const one = (key: string) => imageIds(form, key)[0] ?? "";
  const url = (key: string) => {
    const v = str(form, key, 300);
    return v && !/^https?:\/\//i.test(v) ? `https://${v}` : v;
  };
  const value: SiteSettings = {
    heroImage: one("heroImage") || DEFAULT_SETTINGS.heroImage,
    heroTagline: str(form, "heroTagline", 300),
    bioPhoto: one("bioPhoto") || DEFAULT_SETTINGS.bioPhoto,
    bioText: str(form, "bioText", 30000),
    contactIntro: str(form, "contactIntro", 1000),
    contactEmail: str(form, "contactEmail", 200),
    contactPhone: str(form, "contactPhone", 40),
    instagram: url("instagram"),
    facebook: url("facebook"),
  };
  await db()`
    insert into settings (key, value) values ('site', ${db().json(value)})
    on conflict (key) do update set value = excluded.value`;
  await publish();
  return { ok: "Alterações guardadas e já visíveis no site." };
}

/* ======================================================
   CONTA
====================================================== */

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const [user] = await db()`select password_hash from admin_users where id = ${admin.id}`;
  if (!user || !verifyPassword(current, user.passwordHash)) {
    return { error: "A palavra-passe atual não está correta." };
  }
  if (next.length < 8) return { error: "A nova palavra-passe deve ter pelo menos 8 caracteres." };
  if (next !== confirm) return { error: "As duas novas palavras-passe não coincidem." };

  const hash = hashPassword(next);
  await db()`update admin_users set password_hash = ${hash} where id = ${admin.id}`;
  await createSession(admin.id, hash); // mantém esta sessão; as outras deixam de valer
  return { ok: "Palavra-passe alterada." };
}
