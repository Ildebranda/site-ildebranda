import Link from "next/link";
import { SectionTitle } from "../components/BrushTitle";
import { getExhibitions, getFeaturedWorks, getPosts, getSettings } from "../lib/data";
import { mediaUrl } from "../lib/media";
import { plainExcerpt } from "../lib/markdown";
import { formatDate } from "../lib/format";

export const revalidate = 3600;

const KIND_LABEL = { individual: "Individual", coletiva: "Coletiva" } as const;

export default async function Home() {
  const [s, works, expos, posts] = await Promise.all([
    getSettings(),
    getFeaturedWorks(6),
    getExhibitions({ limit: 3 }),
    getPosts({ limit: 2 }),
  ]);

  return (
    <>
      {/* ================= CAPA ================= */}
      <section className="px-4 md:px-10 lg:px-14 pt-6 md:pt-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(s.heroImage, "full", "/fundo.png")}
          alt="Ildebranda Martins"
          className="w-full max-w-6xl h-auto mx-auto drop-shadow-[0_18px_30px_rgba(36,26,107,0.25)]"
          fetchPriority="high"
        />
        {s.heroTagline && (
          <p className="font-serif italic text-2xl md:text-3xl text-ink-soft text-center max-w-2xl mx-auto mt-8 md:mt-10 leading-snug">
            {s.heroTagline}
          </p>
        )}
      </section>

      {/* ================= OBRAS ================= */}
      {works.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 mt-24 md:mt-32 max-w-7xl">
          <SectionTitle title="Obras" href="/obras" linkLabel="Ver todas" />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            {works.map((w, i) => (
              <Link
                key={w.id}
                href={`/obras#obra-${w.id}`}
                className="group block break-inside-avoid mb-10"
                style={{ transform: `rotate(${[-0.6, 0.5, -0.3, 0.7, -0.5, 0.3][i % 6]}deg)` }}
              >
                <div className="art-frame transition-transform duration-500 group-hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(w.images[0], "thumb")}
                    alt={w.title}
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
                <p className="mt-3 font-serif italic text-xl text-ink group-hover:text-rose transition-colors">
                  {w.title}
                </p>
                {(w.year || w.technique) && (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                    {[w.year, w.technique].filter(Boolean).join(" · ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= EXPOSIÇÕES ================= */}
      {expos.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 mt-20 md:mt-28 max-w-7xl">
          <SectionTitle title="Exposições" href="/lista-de-exposicoes" />
          <ul className="divide-y divide-paper-3">
            {expos.map((e) => (
              <li key={e.id}>
                <Link
                  href="/lista-de-exposicoes"
                  className="group grid grid-cols-[4.5rem_1fr] md:grid-cols-[6rem_1fr_auto] gap-x-6 gap-y-1 items-baseline py-5"
                >
                  <span className="font-brush text-3xl text-ochre leading-none">{e.year}</span>
                  <span className="font-serif text-2xl text-ink group-hover:text-rose transition-colors">
                    {e.title}
                  </span>
                  <span className="col-start-2 md:col-start-3 text-sm text-ink-mute">
                    {[e.location, KIND_LABEL[e.kind]].filter(Boolean).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ================= NOTÍCIAS ================= */}
      {posts.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 mt-20 md:mt-28 max-w-7xl">
          <SectionTitle title="Notícias" href="/noticias" />
          <div className="grid md:grid-cols-2 gap-10">
            {posts.map((p) => (
              <Link key={p.id} href={`/noticias/${p.slug}`} className="group block">
                {p.cover && (
                  <div className="art-frame mb-5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(p.cover, "thumb")}
                      alt=""
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover"
                    />
                  </div>
                )}
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                  {formatDate(p.date)}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mt-1 group-hover:text-rose transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-ink-soft leading-relaxed">{p.excerpt || plainExcerpt(p.body, 140)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= CONTACTO ================= */}
      <section className="px-6 md:px-12 lg:px-16 mt-24 md:mt-32 max-w-7xl">
        <div className="brush-swatch text-paper px-8 md:px-16 py-14 md:py-16 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <p className="font-brush text-4xl md:text-5xl leading-none">Vamos conversar?</p>
            <p className="font-serif italic text-xl mt-3 text-paper/85">
              Encomendas, colaborações, exposições.
            </p>
          </div>
          <Link
            href="/contactos"
            className="self-start md:self-auto shrink-0 bg-paper text-ultra-deep px-7 py-3 text-xs uppercase tracking-[0.25em] hover:bg-ochre transition-colors"
          >
            Contactar
          </Link>
        </div>
      </section>
    </>
  );
}
