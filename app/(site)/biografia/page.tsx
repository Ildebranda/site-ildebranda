import type { Metadata } from "next";
import { BrushTitle, PageShell } from "../../components/BrushTitle";
import { getSettings } from "../../lib/data";
import { renderMarkdown } from "../../lib/markdown";
import { mediaUrl } from "../../lib/media";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Biografia" };

export default async function BiografiaPage() {
  const s = await getSettings();
  const html = await renderMarkdown(s.bioText);

  return (
    <PageShell className="max-w-6xl">
      <BrushTitle>Biografia</BrushTitle>

      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 md:gap-16 items-start">
        {/* Retrato com pincelada atrás */}
        <div className="relative mx-auto w-full max-w-sm md:sticky md:top-12">
          <div className="absolute -inset-5 brush-swatch opacity-90 -rotate-6" aria-hidden />
          <div className="absolute -inset-3 bg-rose/70 rotate-3 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] blur-[1px]" aria-hidden />
          <div className="relative art-frame rotate-[1.5deg]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(s.bioPhoto, "full", "/ildebranda.jpg")}
              alt="Retrato de Ildebranda Martins"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>

        <div className="prose-ilde" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </PageShell>
  );
}
