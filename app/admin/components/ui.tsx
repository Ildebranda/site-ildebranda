"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { FormState } from "../actions";

/* ---------- classes partilhadas ---------- */

export const inputCls =
  "w-full rounded-lg border border-paper-3 bg-white px-3.5 py-2.5 text-[16px] text-ink placeholder:text-ink-mute/70 outline-none focus:border-ultra focus:ring-4 focus:ring-ultra/10 transition";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-ultra px-5 py-2.5 text-[15px] font-medium text-white hover:bg-ultra-deep disabled:opacity-60 transition";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-paper-3 bg-white px-4 py-2.5 text-[15px] text-ink hover:border-ultra hover:text-ultra transition";

/* ---------- campos ---------- */

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[15px] font-medium text-ink mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-sm text-ink-mute">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 rounded accent-ultra cursor-pointer"
      />
      <span>
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {hint && <span className="block text-sm text-ink-mute">{hint}</span>}
      </span>
    </label>
  );
}

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-paper-3 bg-white/80 p-5 md:p-7 space-y-6">
      {title && <h2 className="font-brush text-3xl text-ultra leading-none">{title}</h2>}
      {children}
    </section>
  );
}

/* ---------- formulário com estado ---------- */

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className={btnPrimary}>
      {pending && <Loader2 size={18} className="animate-spin" />}
      {pending ? "A gravar…" : label}
    </button>
  );
}

export function Banner({ state }: { state: FormState }) {
  if (state.error)
    return (
      <div role="alert" className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" /> {state.error}
      </div>
    );
  if (state.ok)
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3">
        <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> {state.ok}
      </div>
    );
  return null;
}

/**
 * Formulário do backoffice: mostra erros/sucesso e não deixa gravar
 * enquanto ainda há imagens a carregar.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "Guardar",
  cancelHref,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      // Submissão manual: assim o React não limpa os campos quando há um erro
      onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.querySelector("[data-uploading]")) {
          alert("Ainda há imagens a carregar. Aguarde uns segundos e grave de novo.");
          return;
        }
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="space-y-6"
    >
      <Banner state={state} />
      {children}
      <div className="sticky bottom-0 -mx-4 md:mx-0 px-4 md:px-0 py-4 bg-paper/90 backdrop-blur border-t border-paper-3 md:border-0 md:bg-transparent md:backdrop-blur-none flex items-center gap-3 z-10">
        <SubmitButton label={submitLabel} pending={pending} />
        {cancelHref && (
          <Link href={cancelHref} className={btnGhost}>
            Cancelar
          </Link>
        )}
      </div>
    </form>
  );
}

/* ---------- botões de ação rápida (apagar, mover, publicar) ---------- */

export function ActionButton({
  action,
  confirmText,
  children,
  className = "",
  title,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <form action={action} className="contents">
      <PendingButton confirmText={confirmText} className={className} title={title}>
        {children}
      </PendingButton>
    </form>
  );
}

function PendingButton({
  confirmText,
  className,
  title,
  children,
}: {
  confirmText?: string;
  className: string;
  title?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={(e) => {
        if (confirmText && !confirm(confirmText)) e.preventDefault();
      }}
      className={`${className} disabled:opacity-40`}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}
