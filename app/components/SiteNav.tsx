"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Instagram, Facebook, Menu, X, Mail } from "lucide-react";

const LINKS = [
  { name: "Início", href: "/" },
  { name: "Obras", href: "/obras" },
  { name: "Exposições", href: "/lista-de-exposicoes" },
  { name: "Notícias", href: "/noticias" },
  { name: "Biografia", href: "/biografia" },
  { name: "Contactos", href: "/contactos" },
];

type Props = { instagram: string; facebook: string; email: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SocialLinks({ instagram, facebook, email, className = "" }: Props & { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-rose transition-colors">
          <Instagram size={19} strokeWidth={1.5} />
        </a>
      )}
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-rose transition-colors">
          <Facebook size={19} strokeWidth={1.5} />
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" className="hover:text-rose transition-colors">
          <Mail size={19} strokeWidth={1.5} />
        </a>
      )}
    </div>
  );
}

export default function SiteNav(props: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Bloqueia o scroll da página com o menu aberto (telemóvel)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ============ DESKTOP: barra lateral ============ */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col justify-between px-10 py-12">
        <Link href="/" className="group block -rotate-2 origin-left">
          <span className="font-brush text-[2.6rem] leading-[0.9] text-ultra block group-hover:text-rose transition-colors">
            Ildebranda
          </span>
          <span className="font-brush text-[2.6rem] leading-[0.9] text-ultra block pl-6 group-hover:text-rose transition-colors">
            Martins
          </span>
        </Link>

        <nav aria-label="Menu principal" className="flex flex-col gap-3">
          {LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`font-serif text-[1.45rem] w-fit transition-colors ${
                  active ? "text-ultra italic brush-underline" : "text-ink-soft hover:text-rose"
                }`}
              >
                {l.name}
              </Link>
            );
          })}
        </nav>

        <SocialLinks {...props} className="text-ink-soft" />
      </aside>

      {/* ============ TELEMÓVEL: barra no topo ============ */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-3 bg-paper/85 backdrop-blur-md border-b border-paper-3/60">
        <Link href="/" className="font-brush text-3xl text-ultra leading-none">
          Ildebranda Martins
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 text-ink"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <Menu size={26} strokeWidth={1.5} />
        </button>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-ultra-deep text-paper flex flex-col px-8 py-6 overflow-y-auto">
          <div className="flex justify-end">
            <button type="button" onClick={() => setOpen(false)} className="p-2 -mr-2" aria-label="Fechar menu">
              <X size={30} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Menu principal" className="flex flex-col gap-5 mt-8">
            {LINKS.map((l, i) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`font-brush text-5xl leading-none w-fit ${active ? "text-ochre" : "text-paper"}`}
                  style={{ transform: `rotate(${i % 2 ? 1 : -1.5}deg)` }}
                >
                  {l.name}
                </Link>
              );
            })}
          </nav>
          <SocialLinks {...props} className="mt-auto pt-10 text-paper/80" />
        </div>
      )}
    </>
  );
}
