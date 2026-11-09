import Link from "next/link";

/** Título de página "pintado", com uma pincelada rosa por baixo. */
export function BrushTitle({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return (
    <header className="mb-12 md:mb-16">
      <h1 className="font-brush text-6xl md:text-7xl text-ultra leading-none inline-block brush-underline pb-1 -rotate-1">
        {children}
      </h1>
      {intro && (
        <p className="mt-6 max-w-2xl font-serif italic text-xl md:text-2xl text-ink-soft">{intro}</p>
      )}
    </header>
  );
}

/** Título de secção (página inicial) com link "ver tudo". */
export function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
      <h2 className="font-brush text-4xl md:text-5xl text-ultra leading-none -rotate-1">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-xs uppercase tracking-[0.25em] text-ink-soft hover:text-rose transition-colors"
        >
          {linkLabel ?? "Ver tudo"} →
        </Link>
      )}
    </div>
  );
}

export function PageShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 md:px-12 lg:px-16 pt-10 md:pt-16 max-w-7xl ${className}`}>{children}</div>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="font-serif italic text-2xl text-ink-mute py-16">{children}</p>;
}
