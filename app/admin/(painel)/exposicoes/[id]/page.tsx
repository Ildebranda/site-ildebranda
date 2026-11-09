import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/PageHeader";
import { getExhibition } from "../../../../lib/data";
import ExhibitionForm from "../ExhibitionForm";

export default async function EditarExposicao({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const expo = id ? await getExhibition(id) : null;
  if (!expo) notFound();

  return (
    <>
      <PageHeader title="Editar exposição" back={{ href: "/admin/exposicoes", label: "Exposições" }} />
      <ExhibitionForm expo={expo} />
    </>
  );
}
