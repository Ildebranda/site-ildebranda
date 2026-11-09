import { PageHeader } from "../../../components/PageHeader";
import ExhibitionForm from "../ExhibitionForm";

export default function NovaExposicao() {
  return (
    <>
      <PageHeader title="Nova exposição" back={{ href: "/admin/exposicoes", label: "Exposições" }} />
      <ExhibitionForm />
    </>
  );
}
