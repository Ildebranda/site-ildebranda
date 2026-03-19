// src/components/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  const links = [
    { name: "Inicio", href: "/" },
    { name: "Biografia", href: "/biografia" },
    { name: "Contactos", href: "/contactos" },
    { name: "Obras", href: "/obras" },
    { name: "Exposições", href: "/lista-de-exposicoes" },
    { name: "Notícias", href: "/noticias" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-32 flex flex-col justify-center items-start pl-8 z-50 bg-white">
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[18px] text-zinc-600 font-medium hover:text-blue-600 transition-colors tracking-wide"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
