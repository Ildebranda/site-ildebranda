"use client";

import { useRef } from "react";
import { Bold, Heading2, Italic, Link2, List, Quote } from "lucide-react";
import { inputCls } from "./ui";

const TOOLS = [
  { icon: Bold, label: "Negrito" },
  { icon: Italic, label: "Itálico" },
  { icon: Heading2, label: "Subtítulo" },
  { icon: List, label: "Lista" },
  { icon: Quote, label: "Citação" },
  { icon: Link2, label: "Link" },
] as const;

/**
 * Caixa de texto com botões simples. Por trás guarda "markdown",
 * mas a Ilde só precisa de saber: linha em branco = novo parágrafo.
 */
export default function TextEditor({
  name,
  defaultValue = "",
  rows = 10,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after = before, placeholderText = "texto") {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholderText;
    el.setRangeText(before + selected + after, s, e, "end");
    el.focus();
    el.setSelectionRange(s + before.length, s + before.length + selected.length);
  }

  function linePrefix(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(lineStart, e);
    const replaced = block
      .split("\n")
      .map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : prefix + l))
      .join("\n");
    el.setRangeText(replaced, lineStart, e, "end");
    el.focus();
  }

  function link() {
    const url = prompt("Endereço do link (ex.: https://…)");
    if (!url) return;
    wrap("[", `](${/^https?:\/\//.test(url) || url.startsWith("mailto:") ? url : "https://" + url})`, "texto do link");
  }

  function run(label: (typeof TOOLS)[number]["label"]) {
    if (label === "Negrito") wrap("**");
    else if (label === "Itálico") wrap("*");
    else if (label === "Subtítulo") linePrefix("## ");
    else if (label === "Lista") linePrefix("- ");
    else if (label === "Citação") linePrefix("> ");
    else link();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => run(t.label)}
            title={t.label}
            aria-label={t.label}
            className="p-2 rounded-md text-ink-soft hover:bg-paper-2 hover:text-ultra"
          >
            <t.icon size={18} />
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`${inputCls} font-serif !text-lg leading-relaxed resize-y`}
      />
      <p className="mt-1.5 text-sm text-ink-mute">
        Deixe uma linha em branco para começar um novo parágrafo. Selecione texto e use os botões para formatar.
      </p>
    </div>
  );
}
