import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "../../lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function EntrarPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="paper-grain min-h-screen flex items-center justify-center px-5 py-12 bg-paper">
      <div className="watercolor-wash" aria-hidden />
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="font-brush text-6xl text-ultra leading-[0.9] -rotate-2 text-center">
          Ildebranda
          <br />
          <span className="pl-10">Martins</span>
        </h1>
        <p className="text-center text-sm uppercase tracking-[0.3em] text-ink-mute mt-4 mb-10">Backoffice</p>
        <div className="art-frame !p-7 rounded-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
