/**
 * Prepara a base de dados do site.
 *
 *   npm run db:setup                 → cria/atualiza as tabelas
 *   npm run db:setup -- --import     → + importa os ficheiros antigos de content/ e public/uploads
 *
 * Se ADMIN_EMAIL e ADMIN_PASSWORD estiverem definidos (.env.local ou ambiente),
 * cria a conta da Ilde — ou, se já existir, troca-lhe a palavra-passe.
 * Pode ser corrido várias vezes sem estragar nada.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import matter from "gray-matter";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✖ Falta DATABASE_URL (coloque-o em .env.local).");
  process.exit(1);
}

const ca = process.env.DATABASE_CA_CERT;
const sql = postgres(url, {
  max: 1,
  onnotice: () => {},
  ...(ca ? { ssl: { ca, rejectUnauthorized: true } } : {}),
});

const SCHEMA = `
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  filename text not null default '',
  mime text not null,
  width int,
  height int,
  data bytea not null,
  thumb bytea,
  thumb_mime text,
  created_at timestamptz not null default now()
);

create table if not exists works (
  id serial primary key,
  title text not null,
  category text not null default '',
  year text not null default '',
  technique text not null default '',
  dimensions text not null default '',
  description text not null default '',
  status text not null default '',
  images uuid[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exhibitions (
  id serial primary key,
  title text not null,
  kind text not null default 'individual',
  year text not null default '',
  dates text not null default '',
  location text not null default '',
  description text not null default '',
  images uuid[] not null default '{}',
  link text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id serial primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover uuid,
  published_at date not null default current_date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}'
);

create table if not exists admin_users (
  id serial primary key,
  email text not null unique,
  name text not null default '',
  password_hash text not null,
  created_at timestamptz not null default now()
);
`;

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  /* sem miniaturas — o site usa a imagem inteira */
}

const mediaCache = new Map();
async function importImage(publicPath) {
  if (!publicPath) return null;
  if (mediaCache.has(publicPath)) return mediaCache.get(publicPath);
  const file = path.join(process.cwd(), "public", decodeURIComponent(publicPath));
  if (!fs.existsSync(file)) {
    console.warn(`  ! imagem não encontrada: ${publicPath}`);
    return null;
  }
  let data = fs.readFileSync(file);
  let mime = MIME[path.extname(file).toLowerCase()] ?? "image/jpeg";
  let thumb = null;
  let width = null;
  let height = null;
  if (sharp) {
    const img = sharp(data).rotate();
    const meta = await img.metadata();
    if (Math.max(meta.width ?? 0, meta.height ?? 0) > 2400) {
      data = await img.resize(2400, 2400, { fit: "inside" }).jpeg({ quality: 86 }).toBuffer();
      mime = "image/jpeg";
    }
    const m2 = await sharp(data).metadata();
    width = m2.width ?? null;
    height = m2.height ?? null;
    thumb = await sharp(data).resize(800, 800, { fit: "inside" }).jpeg({ quality: 80 }).toBuffer();
  }
  const [row] = await sql`
    insert into media (filename, mime, width, height, data, thumb, thumb_mime)
    values (${path.basename(file)}, ${mime}, ${width}, ${height}, ${data}, ${thumb}, ${thumb ? "image/jpeg" : null})
    returning id`;
  mediaCache.set(publicPath, row.id);
  return row.id;
}

function readCollection(dir) {
  const full = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), ...matter(fs.readFileSync(path.join(full, f), "utf8")) }));
}

async function importLegacy() {
  const [{ n }] = await sql`select (select count(*) from works) + (select count(*) from exhibitions) + (select count(*) from posts) as n`;
  if (Number(n) > 0) {
    console.log("• Já existem conteúdos na base de dados — importação ignorada.");
    return;
  }

  const works = readCollection("obras");
  let pos = 0;
  for (const { data, content } of works) {
    const img = await importImage(data.image);
    await sql`
      insert into works (title, category, description, images, position)
      values (${data.title ?? "Sem título"}, ${data.category ?? ""},
              ${[data.description, content?.trim()].filter(Boolean).join("\n\n")},
              ${img ? [img] : []}, ${pos++})`;
  }
  console.log(`• Obras importadas: ${works.length}`);

  const expos = readCollection("exposicoes");
  for (const { data, content } of expos) {
    const img = await importImage(data.image);
    const kind = String(data.category ?? "").toLowerCase().startsWith("indiv") ? "individual" : "coletiva";
    await sql`
      insert into exhibitions (title, kind, year, location, description, images)
      values (${data.title ?? ""}, ${kind}, ${String(data.year ?? "")}, ${data.location ?? ""},
              ${content?.trim() ?? ""}, ${img ? [img] : []})`;
  }
  console.log(`• Exposições importadas: ${expos.length}`);

  const posts = readCollection("blog");
  for (const { slug, data, content } of posts) {
    const img = await importImage(data.image);
    const date = data.date ? new Date(data.date) : new Date();
    await sql`
      insert into posts (slug, title, body, cover, published_at)
      values (${slug}, ${data.title ?? ""}, ${content?.trim() ?? ""}, ${img}, ${date})
      on conflict (slug) do nothing`;
  }
  console.log(`• Notícias importadas: ${posts.length}`);
}

try {
  await sql.unsafe(SCHEMA);
  await sql`insert into settings (key, value) values ('site', '{}') on conflict do nothing`;
  console.log("✔ Tabelas prontas.");

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 8) throw new Error("ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");
    await sql`
      insert into admin_users (email, name, password_hash)
      values (${email}, ${process.env.ADMIN_NAME ?? "Ilde"}, ${hashPassword(password)})
      on conflict (email) do update set password_hash = excluded.password_hash`;
    console.log(`✔ Conta do backoffice pronta: ${email}`);
  } else {
    const [{ n }] = await sql`select count(*)::int as n from admin_users`;
    if (n === 0) console.log("! Ainda não há conta de acesso. Defina ADMIN_EMAIL e ADMIN_PASSWORD e corra de novo.");
  }

  if (process.argv.includes("--import")) await importLegacy();
} catch (err) {
  console.error("✖", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
