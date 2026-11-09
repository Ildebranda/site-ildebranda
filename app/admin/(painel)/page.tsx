import Link from "next/link";
import { CalendarDays, FileText, Inbox, Newspaper, Palette, Plus } from "lucide-react";
import { getCounts, getMessages } from "../../lib/data";

export default async function PainelPage() {
  const [counts, messages] = await Promise.all([getCounts(), getMessages()]);
  const latest = messages.filter((m) => !m.read).slice(0, 3);

  const quick = [
    { href: "/admin/obras/nova", label: "Adicionar obra", icon: Palette, n: counts.works, unit: "obras" },
    { href: "/admin/exposicoes/nova", label: "Adicionar exposição", icon: CalendarDays, n: counts.exhibitions, unit: "exposições" },
    { href: "/admin/noticias/nova", label: "Escrever notícia", icon: Newspaper, n: counts.posts, unit: "notícias" },
  ];

  return (
    <>
      <h1 className="font-brush text-5xl text-ultra leading-none">Olá, Ilde!</h1>
      <p className="mt-2 text-ink-soft text-lg">O que quer fazer hoje?</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {quick.map(({ href, label, icon: Icon, n, unit }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-paper-3 bg-white/80 p-5 hover:border-ultra hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-xl bg-ultra/10 text-ultra flex items-center justify-center">
                <Icon size={22} />
              </span>
              <Plus size={20} className="text-ink-mute group-hover:text-ultra" />
            </div>
            <p className="mt-4 font-medium text-ink text-lg">{label}</p>
            <p className="text-sm text-ink-mute">
              {n} {unit} no site
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-paper-3 bg-white/80 p-5 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-medium">
            <Inbox size={20} className="text-ultra" /> Mensagens novas
            {counts.unread > 0 && (
              <span className="rounded-full bg-rose text-white text-xs font-semibold px-2 py-0.5">{counts.unread}</span>
            )}
          </h2>
          <Link href="/admin/mensagens" className="text-sm text-ultra hover:underline">
            Ver todas →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="mt-4 text-ink-mute">Não há mensagens por ler.</p>
        ) : (
          <ul className="mt-4 divide-y divide-paper-3">
            {latest.map((m) => (
              <li key={m.id} className="py-3">
                <p className="font-medium">
                  {m.name} <span className="font-normal text-ink-mute text-sm">· {m.email}</span>
                </p>
                <p className="text-ink-soft line-clamp-2">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/admin/paginas"
        className="mt-6 flex items-center gap-4 rounded-2xl border border-paper-3 bg-white/80 p-5 hover:border-ultra transition"
      >
        <span className="w-11 h-11 rounded-xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
          <FileText size={22} />
        </span>
        <span>
          <span className="block font-medium text-lg">Textos do site</span>
          <span className="block text-sm text-ink-mute">
            Imagem da capa, biografia, fotografia, email e redes sociais.
          </span>
        </span>
      </Link>
    </>
  );
}
