import type { Metadata } from "next";
import { BrushTitle, EmptyState, PageShell } from "../../components/BrushTitle";
import ExhibitionsTimeline from "../../components/ExhibitionsTimeline";
import { getExhibitions } from "../../lib/data";
import { renderMarkdown } from "../../lib/markdown";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Exposições" };

export default async function ExposicoesPage() {
  const expos = await getExhibitions();
  const withHtml = await Promise.all(
    expos.map(async (e) => ({ ...e, descriptionHtml: await renderMarkdown(e.description) }))
  );

  return (
    <PageShell className="max-w-5xl">
      <BrushTitle>Exposições</BrushTitle>
      {expos.length ? (
        <ExhibitionsTimeline exhibitions={withHtml} />
      ) : (
        <EmptyState>Brevemente, novas exposições.</EmptyState>
      )}
    </PageShell>
  );
}
