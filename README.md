# Ildebranda Martins: site e backoffice

Site em Next.js 16 alojado no **Vercel**. Os conteúdos (obras, exposições, notícias,
textos, imagens e mensagens de contacto) ficam numa base de dados **PostgreSQL no Aiven**.
A Ilde gere tudo em **`/admin`** com email e palavra-passe. As alterações aparecem no
site logo a seguir, sem GitHub nem novo deploy.

## Estrutura

| Pasta | O quê |
| --- | --- |
| `app/(site)/` | Páginas públicas (Início, Obras, Exposições, Notícias, Biografia, Contactos) |
| `app/admin/` | Backoffice: `entrar/` (login) e `(painel)/` (tudo o resto) |
| `app/admin/actions.ts` | Gravar, apagar, ordenar e publicar conteúdos |
| `app/lib/` | Base de dados, sessão, leitura de conteúdos |
| `app/media/[id]` | Serve as imagens guardadas na base de dados (com cache longa) |
| `app/api/admin/upload` | Recebe imagens; o browser reduz-las antes do envio (máx. 2400 px + miniatura) |
| `scripts/setup.mjs` | Cria as tabelas e a conta, e importa o conteúdo antigo de `content/` |

## Primeira instalação

1. **Aiven**: criar um serviço PostgreSQL (o plano gratuito chega) e copiar o *Service URI*.
2. **Local**: `cp .env.example .env.local` e preencher `DATABASE_URL`, `SESSION_SECRET`,
   `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
3. Criar as tabelas e a conta da Ilde, e importar o conteúdo antigo (Markdown + `public/uploads`):
   ```bash
   yarn install
   npm run db:setup -- --import
   ```
4. **Vercel**, em *Settings → Environment Variables*: definir `DATABASE_URL` e `SESSION_SECRET`
   (e `DATABASE_CA_CERT`, se o usar). Depois, fazer *redeploy*.
5. Entrar em `https://<site>/admin`.

> Depois da importação, as pastas `content/` e `public/uploads/` deixam de ser usadas e podem ser apagadas.
> O projeto `cms-admin` (Decap CMS) também deixa de ser necessário.

## Tarefas comuns

- **A Ilde esqueceu-se da palavra-passe**: definir uma nova em `ADMIN_PASSWORD` no `.env.local`
  e correr `npm run db:setup`. Isto termina também as sessões abertas.
- **Desenvolvimento**: `yarn dev`. Sem `DATABASE_URL`, o site abre com os textos por omissão
  e listas vazias, o que dá para trabalhar no design.

## Notas técnicas

- As páginas públicas são estáticas (ISR). Cada gravação no backoffice chama
  `revalidatePath("/", "layout")`, por isso o site atualiza na hora. Como reserva, há também
  revalidação de hora a hora.
- As imagens que deixam de ser usadas são apagadas automaticamente, com 1 dia de margem.
- O formulário de contactos grava as mensagens na base de dados (em *Mensagens* no backoffice)
  e tem um campo-armadilha contra robôs.
