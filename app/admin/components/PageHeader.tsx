import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";

export function PageHeader({
  title,
  intro,
  newHref,
  newLabel,
  back,
}: {
  title: string;
  intro?: string;
  newHref?: string;
  newLabel?: string;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="inline-block text-sm text-ink-soft hover:text-ultra mb-3">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-brush text-5xl text-ultra leading-none">{title}</h1>
          {intro && <p className="mt-2 text-ink-soft max-w-xl">{intro}</p>}
        </div>
        {newHref && (
          <Link
            href={newHref}
            className="inline-flex items-center gap-2 rounded-lg bg-ultra px-5 py-2.5 text-[15px] font-medium text-white hover:bg-ultra-deep transition"
          >
            <Plus size={18} /> {newLabel}
          </Link>
        )}
      </div>
    </header>
  );
}

const FLASH: Record<string, string> = {
  criada: "Guardado com sucesso.",
  editada: "Alterações guardadas.",
  apagada: "Apagado.",
};

export function Flash({ ok }: { ok?: string | string[] }) {
  const msg = typeof ok === "string" ? FLASH[ok] : undefined;
  if (!msg) return null;
  return (
    <div role="status" className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3">
      <CheckCircle2 size={20} /> {msg}
    </div>
  );
}

export function Badge({ children, tone = "mute" }: { children: React.ReactNode; tone?: "mute" | "rose" | "ochre" | "ultra" }) {
  const cls = {
    mute: "bg-paper-2 text-ink-soft",
    rose: "bg-rose/10 text-rose",
    ochre: "bg-ochre/15 text-[#8a6418]",
    ultra: "bg-ultra/10 text-ultra",
  }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

export function EmptyList({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-paper-3 px-6 py-14 text-center text-ink-soft">
      {children}
    </div>
  );
}
