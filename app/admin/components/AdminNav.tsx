"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Home,
  Inbox,
  LogOut,
  Menu,
  Newspaper,
  Palette,
  UserRound,
  X,
} from "lucide-react";
import { logout } from "../actions";

const LINKS = [
  { href: "/admin", label: "Painel", icon: Home },
  { href: "/admin/obras", label: "Obras", icon: Palette },
  { href: "/admin/exposicoes", label: "Exposições", icon: CalendarDays },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/mensagens", label: "Mensagens", icon: Inbox },
  { href: "/admin/paginas", label: "Textos do site", icon: FileText },
  { href: "/admin/conta", label: "A minha conta", icon: UserRound },
];

export default function AdminNav({ unread, name }: { unread: number; name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition ${
              active ? "bg-ultra text-white" : "text-ink-soft hover:bg-paper-2 hover:text-ink"
            }`}
          >
            <Icon size={19} strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            {href === "/admin/mensagens" && unread > 0 && (
              <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${active ? "bg-white text-ultra" : "bg-rose text-white"}`}>
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-paper-3 pt-4">
      <a
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-ink-soft hover:bg-paper-2 hover:text-ink"
      >
        <ExternalLink size={19} strokeWidth={1.75} /> Ver o site
      </a>
      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-ink-soft hover:bg-paper-2 hover:text-ink"
        >
          <LogOut size={19} strokeWidth={1.75} /> Sair
        </button>
      </form>
    </div>
  );

  const brand = (
    <Link href="/admin" className="block">
      <span className="font-brush text-3xl text-ultra leading-none">Ildebranda</span>
      <span className="block text-[11px] uppercase tracking-[0.25em] text-ink-mute mt-1">
        Olá, {name || "Ilde"}
      </span>
    </Link>
  );

  return (
    <>
      {/* Computador */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col gap-8 border-r border-paper-3 bg-paper px-4 py-6">
        <div className="px-3">{brand}</div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        {footer}
      </aside>

      {/* Telemóvel */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-paper-3 bg-paper/95 backdrop-blur px-4 py-3">
        <Link href="/admin" className="font-brush text-2xl text-ultra leading-none">
          Ildebranda
        </Link>
        <button type="button" onClick={() => setOpen(true)} className="relative p-2 -mr-2" aria-label="Abrir menu">
          <Menu size={24} />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose" />}
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-paper flex flex-col gap-6 px-4 py-5 shadow-xl">
            <div className="flex items-start justify-between px-3">
              {brand}
              <button type="button" onClick={() => setOpen(false)} className="p-1" aria-label="Fechar menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
            {footer}
          </div>
        </div>
      )}
    </>
  );
}
