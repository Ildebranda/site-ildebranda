import { savePost } from "../../actions";
import ImageUploader from "../../components/ImageUploader";
import TextEditor from "../../components/TextEditor";
import { AdminForm, Card, Checkbox, Field, inputCls } from "../../components/ui";
import type { Post } from "../../../lib/types";

export default function PostForm({ post }: { post?: Post }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminForm action={savePost} cancelHref="/admin/noticias" submitLabel={post ? "Guardar alterações" : "Publicar notícia"}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <Card>
        <Field label="Título *" htmlFor="title">
          <input id="title" name="title" required defaultValue={post?.title} className={`${inputCls} !text-lg`} />
        </Field>
        <div className="grid sm:grid-cols-[12rem_1fr] gap-5">
          <Field label="Data" htmlFor="date">
            <input id="date" name="date" type="date" required defaultValue={post?.date ?? today} className={inputCls} />
          </Field>
          <Field label="Resumo (opcional)" htmlFor="excerpt" hint="Uma ou duas frases para a lista de notícias.">
            <input id="excerpt" name="excerpt" defaultValue={post?.excerpt} className={inputCls} />
          </Field>
        </div>
        <Field label="Imagem de capa">
          <ImageUploader name="cover" initial={post?.cover ? [post.cover] : []} />
        </Field>
      </Card>

      <Card title="Texto">
        <TextEditor name="body" defaultValue={post?.body} rows={16} placeholder="Escreva aqui a notícia…" />
      </Card>

      <Card>
        <Checkbox
          name="published"
          label="Publicada no site"
          hint="Desligue para guardar como rascunho e terminar mais tarde."
          defaultChecked={post ? post.published : true}
        />
      </Card>
    </AdminForm>
  );
}
