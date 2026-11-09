import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteMessage, setMessageRead } from "../../actions";
import { EmptyList, PageHeader } from "../../components/PageHeader";
import { ActionButton, btnGhost } from "../../components/ui";
import { getMessages } from "../../../lib/data";

export default async function MensagensAdmin() {
  const messages = await getMessages();

  return (
    <>
      <PageHeader title="Mensagens" intro="Tudo o que as pessoas escrevem no formulário da página Contactos." />

      {messages.length === 0 ? (
        <EmptyList>Ainda não chegou nenhuma mensagem.</EmptyList>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border p-5 ${m.read ? "border-paper-3 bg-white/60" : "border-ultra/40 bg-white shadow-sm"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-lg flex items-center gap-2">
                    {!m.read && <span className="w-2.5 h-2.5 rounded-full bg-rose" aria-label="Por ler" />}
                    {m.name}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-ultra text-sm hover:underline break-all">
                    {m.email}
                  </a>
                </div>
                <time className="text-sm text-ink-mute">
                  {new Date(m.createdAt).toLocaleString("pt-PT", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Lisbon",
                  })}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-line text-ink leading-relaxed">{m.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: a sua mensagem")}`}
                  className={btnGhost}
                >
                  <Reply size={17} /> Responder
                </a>
                <ActionButton action={setMessageRead.bind(null, m.id, !m.read)} className={btnGhost}>
                  {m.read ? <Mail size={17} /> : <MailOpen size={17} />}
                  {m.read ? "Marcar como por ler" : "Marcar como lida"}
                </ActionButton>
                <ActionButton
                  action={deleteMessage.bind(null, m.id)}
                  confirmText="Apagar esta mensagem?"
                  className={`${btnGhost} hover:!text-red-600 hover:!border-red-300`}
                >
                  <Trash2 size={17} /> Apagar
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
