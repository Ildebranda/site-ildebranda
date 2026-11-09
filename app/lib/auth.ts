import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, hasDatabase } from "./db";

/*
 * Sessão do backoffice: cookie assinado (HMAC) com o id da utilizadora,
 * a data de expiração e uma "impressão" da palavra-passe — ao mudar a
 * palavra-passe, todas as sessões antigas deixam de ser válidas.
 */

const COOKIE = "ilde_admin";
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 dias

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET em falta ou demasiado curto (mínimo 16 caracteres).");
  }
  return s;
}

/* ---------- palavras-passe (scrypt) ---------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, "base64"), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

/* ---------- cookie ---------- */

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function fingerprint(passwordHash: string): string {
  return crypto.createHash("sha256").update(passwordHash).digest("base64url").slice(0, 12);
}

export async function createSession(userId: number, passwordHash: string) {
  const payload = Buffer.from(
    JSON.stringify({ u: userId, e: Date.now() + MAX_AGE_S * 1000, f: fingerprint(passwordHash) })
  ).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export type AdminUser = { id: number; email: string; name: string };

export async function getAdmin(): Promise<AdminUser | null> {
  if (!hasDatabase) return null;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;

  let data: { u: number; e: number; f: string };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
  if (!data.u || data.e < Date.now()) return null;

  const rows = await db()`
    select id, email, name, password_hash from admin_users where id = ${data.u}`;
  const user = rows[0];
  if (!user || fingerprint(user.passwordHash) !== data.f) return null;
  return { id: user.id, email: user.email, name: user.name };
}

/** Para páginas e ações do backoffice: sem sessão → página de entrada. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/entrar");
  return admin;
}
