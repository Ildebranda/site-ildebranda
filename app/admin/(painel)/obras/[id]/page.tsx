import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/PageHeader";
import { getWork, getWorkCategories } from "../../../../lib/data";
import WorkForm from "../WorkForm";

export default async function EditarObra({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [work, categories] = await Promise.all([id ? getWork(id) : null, getWorkCategories()]);
  if (!work) notFound();

  return (
    <>
      <PageHeader title="Editar obra" back={{ href: "/admin/obras", label: "Obras" }} />
      <WorkForm work={work} categories={categories} />
    </>
  );
}
