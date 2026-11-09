import type { Metadata } from "next";
import { BrushTitle, EmptyState, PageShell } from "../../components/BrushTitle";
import WorksGallery from "../../components/WorksGallery";
import { getWorks } from "../../lib/data";
import { renderMarkdown } from "../../lib/markdown";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Obras" };

export default async function ObrasPage() {
  const works = await getWorks();
  const withHtml = await Promise.all(
    works.map(async (w) => ({ ...w, descriptionHtml: await renderMarkdown(w.description) }))
  );
  const categories = [...new Set(works.map((w) => w.category).filter(Boolean))];

  return (
    <PageShell>
      <BrushTitle>Obras</BrushTitle>
      {works.length ? (
        <WorksGallery works={withHtml} categories={categories} />
      ) : (
        <EmptyState>Em breve, novas obras.</EmptyState>
      )}
    </PageShell>
  );
}
