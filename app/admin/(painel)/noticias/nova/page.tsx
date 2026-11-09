import { PageHeader } from "../../../components/PageHeader";
import PostForm from "../PostForm";

export default function NovaNoticia() {
  return (
    <>
      <PageHeader title="Nova notícia" back={{ href: "/admin/noticias", label: "Notícias" }} />
      <PostForm />
    </>
  );
}
