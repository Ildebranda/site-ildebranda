import { PageHeader } from "../../../components/PageHeader";
import { getWorkCategories } from "../../../../lib/data";
import WorkForm from "../WorkForm";

export default async function NovaObra() {
  const categories = await getWorkCategories();
  return (
    <>
      <PageHeader title="Nova obra" back={{ href: "/admin/obras", label: "Obras" }} />
      <WorkForm categories={categories} />
    </>
  );
}
