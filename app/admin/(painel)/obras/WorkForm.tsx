import { saveWork } from "../../actions";
import ImageUploader from "../../components/ImageUploader";
import TextEditor from "../../components/TextEditor";
import { AdminForm, Card, Checkbox, Field, inputCls } from "../../components/ui";
import type { Work } from "../../../lib/types";

export default function WorkForm({ work, categories }: { work?: Work; categories: string[] }) {
  const suggestions = [...new Set([...categories, "Pintura", "Colagem", "Escultura", "Instalações", "Desenho"])];

  return (
    <AdminForm action={saveWork} cancelHref="/admin/obras" submitLabel={work ? "Guardar alterações" : "Adicionar obra"}>
      {work && <input type="hidden" name="id" value={work.id} />}

      <Card title="Fotografias">
        <ImageUploader name="images" initial={work?.images} multiple />
        <p className="text-sm text-ink-mute -mt-2">
          A primeira fotografia é a capa. Pode juntar pormenores ou outros ângulos.
        </p>
      </Card>

      <Card title="Sobre a obra">
        <Field label="Título *" htmlFor="title">
          <input id="title" name="title" required defaultValue={work?.title} className={inputCls} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Categoria" htmlFor="category" hint="Escolha da lista ou escreva uma nova.">
            <input id="category" name="category" list="cat-list" defaultValue={work?.category} className={inputCls} />
            <datalist id="cat-list">
              {suggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Ano" htmlFor="year">
            <input id="year" name="year" inputMode="numeric" placeholder="2025" defaultValue={work?.year} className={inputCls} />
          </Field>
          <Field label="Técnica" htmlFor="technique">
            <input id="technique" name="technique" placeholder="Acrílico e colagem sobre tela" defaultValue={work?.technique} className={inputCls} />
          </Field>
          <Field label="Dimensões" htmlFor="dimensions">
            <input id="dimensions" name="dimensions" placeholder="50 × 70 cm" defaultValue={work?.dimensions} className={inputCls} />
          </Field>
        </div>

        <Field label="Estado" htmlFor="status">
          <select id="status" name="status" defaultValue={work?.status ?? ""} className={inputCls}>
            <option value="">Não mostrar</option>
            <option value="disponivel">Disponível</option>
            <option value="vendida">Vendida</option>
            <option value="colecao">Coleção particular</option>
          </select>
        </Field>

        <Field label="Descrição" htmlFor="description">
          <TextEditor name="description" defaultValue={work?.description} rows={7} placeholder="Conte a história desta obra…" />
        </Field>
      </Card>

      <Card title="Visibilidade">
        <Checkbox
          name="published"
          label="Publicada no site"
          hint="Desligue para guardar como rascunho (só visível aqui)."
          defaultChecked={work ? work.published : true}
        />
        <Checkbox
          name="featured"
          label="Destaque na página inicial"
          hint="As obras em destaque aparecem logo na entrada do site."
          defaultChecked={work?.featured}
        />
      </Card>
    </AdminForm>
  );
}
