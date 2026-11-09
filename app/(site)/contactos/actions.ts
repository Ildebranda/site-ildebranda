"use server";

import { db, hasDatabase } from "../../lib/db";

export type ContactState = { ok: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Campo escondido: se vier preenchido, foi um robô
  if (String(form.get("website") ?? "")) return { ok: true };

  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);

  if (!name || !email || !message) return { ok: false, error: "Preencha todos os campos, por favor." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "O email não parece válido." };
  if (!hasDatabase) return { ok: false, error: "O formulário ainda não está configurado." };

  try {
    await db()`insert into messages (name, email, message) values (${name}, ${email}, ${message})`;
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível enviar agora. Tente de novo ou use o email." };
  }
}
