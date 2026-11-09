"use client";

import { startTransition, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendMessage, type ContactState } from "../(site)/contactos/actions";

const field =
  "w-full bg-transparent border-b-2 border-paper-3 focus:border-ultra outline-none py-2 text-lg text-ink placeholder:text-ink-mute/60 transition-colors";
const label = "block text-[11px] uppercase tracking-[0.25em] text-ink-mute";

export function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false });

  if (state.ok) {
    return (
      <div className="py-10">
        <p className="font-brush text-5xl text-ultra -rotate-1">Obrigada!</p>
        <p className="font-serif italic text-2xl text-ink-soft mt-4">
          A sua mensagem foi enviada. Responderei assim que possível.
        </p>
      </div>
    );
  }

  return (
    <form
      // Submissão manual: em caso de erro, o texto escrito não se perde
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-8"
    >
      {/* armadilha para robôs: invisível para pessoas */}
      <div className="hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="c-name" className={label}>Nome</label>
        <input id="c-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className={label}>Email</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="c-message" className={label}>Mensagem</label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          className={`${field} resize-y`}
        />
      </div>

      {state.error && <p className="text-rose" role="alert">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-ultra text-paper px-8 py-3.5 text-xs uppercase tracking-[0.3em] hover:bg-rose transition-colors disabled:opacity-60"
      >
        {pending ? "A enviar…" : "Enviar mensagem"}
      </button>
    </form>
  );
}

/** Versão que preenche a mensagem quando se vem de "Perguntar por esta obra". */
export function ContactFormFromParams() {
  const obra = useSearchParams().get("obra");
  return (
    <ContactForm
      key={obra ?? ""}
      defaultMessage={obra ? `Olá Ilde, gostaria de saber mais sobre a obra "${obra}".\n\n` : ""}
    />
  );
}
