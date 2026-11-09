"use client";

import { startTransition, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "../actions";
import { Banner, Field, btnPrimary, inputCls } from "../components/ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form
      // Submissão manual: o email não se apaga depois de uma palavra-passe errada
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-5"
    >
      <Banner state={state} />
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="username" className={inputCls} />
      </Field>
      <Field label="Palavra-passe" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputCls}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${btnPrimary} w-full !py-3`}>
        {pending && <Loader2 size={18} className="animate-spin" />}
        Entrar
      </button>
    </form>
  );
}
