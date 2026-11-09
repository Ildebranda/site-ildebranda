import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/PageHeader";
import { getPost } from "../../../../lib/data";
import PostForm from "../PostForm";

export default async function EditarNoticia({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const post = id ? await getPost(id) : null;
  if (!post) notFound();

  return (
    <>
      <PageHeader title="Editar notícia" back={{ href: "/admin/noticias", label: "Notícias" }} />
      <PostForm post={post} />
    </>
  );
}
