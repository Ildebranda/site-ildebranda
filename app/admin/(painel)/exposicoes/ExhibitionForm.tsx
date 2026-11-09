import { saveExhibition } from "../../actions";
import ImageUploader from "../../components/ImageUploader";
import TextEditor from "../../components/TextEditor";
import { AdminForm, Card, Checkbox, Field, inputCls } from "../../components/ui";
import type { Exhibition } from "../../../lib/types";

export default function ExhibitionForm({ expo }: { expo?: Exhibition }) {
  return (
    <AdminForm
      action={saveExhibition}
      cancelHref="/admin/exposicoes"
      submitLabel={expo ? "Guardar alterações" : "Adicionar exposição"}
    >
      {expo && <input type="hidden" name="id" value={expo.id} />}

      <Card title="A exposição">
        <Field label="Título *" htmlFor="title">
          <input id="title" name="title" required defaultValue={expo?.title} className={inputCls} />
        </Field>

        <fieldset>
          <legend className="block text-[15px] font-medium text-ink mb-2">Tipo</legend>
          <div className="flex flex-wrap gap-3">
            {[
              { v: "individual", l: "Individual" },
              { v: "coletiva", l: "Coletiva (em grupo)" },
            ].map(({ v, l }) => (
              <label
                key={v}
                className="flex items-center gap-2.5 rounded-lg border border-paper-3 bg-white px-4 py-2.5 cursor-pointer has-[:checked]:border-ultra has-[:checked]:bg-ultra/5"
              >
                <input type="radio" name="kind" value={v} defaultChecked={(expo?.kind ?? "individual") === v} className="accent-ultra w-4 h-4" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-[8rem_1fr] gap-5">
          <Field label="Ano *" htmlFor="year">
            <input
              id="year"
              name="year"
              required
              inputMode="numeric"
              pattern="\d{4}"
              placeholder="2025"
              defaultValue={expo?.year ?? String(new Date().getFullYear())}
              className={inputCls}
            />
          </Field>
          <Field label="Datas" htmlFor="dates" hint="Texto livre, ex.: 12 de março a 30 de abril">
            <input id="dates" name="dates" defaultValue={expo?.dates} className={inputCls} />
          </Field>
        </div>

        <Field label="Local" htmlFor="location">
          <input id="location" name="location" placeholder="Galeria Municipal, Lisboa" defaultValue={expo?.location} className={inputCls} />
        </Field>

        <Field label="Link (opcional)" htmlFor="link" hint="Página da galeria, notícia, evento no Facebook…">
          <input id="link" name="link" type="text" inputMode="url" placeholder="https://" defaultValue={expo?.link} className={inputCls} />
        </Field>

        <Field label="Descrição (opcional)" htmlFor="description">
          <TextEditor name="description" defaultValue={expo?.description} rows={6} />
        </Field>
      </Card>

      <Card title="Fotografias">
        <ImageUploader name="images" initial={expo?.images} multiple />
        <p className="text-sm text-ink-mute -mt-2">Cartaz, vistas da sala, inauguração… (opcional)</p>
      </Card>

      <Card>
        <Checkbox
          name="published"
          label="Publicada no site"
          hint="Desligue para guardar como rascunho."
          defaultChecked={expo ? expo.published : true}
        />
      </Card>
    </AdminForm>
  );
}
