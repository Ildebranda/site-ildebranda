import { saveSettings } from "../../actions";
import { PageHeader } from "../../components/PageHeader";
import ImageUploader from "../../components/ImageUploader";
import TextEditor from "../../components/TextEditor";
import { AdminForm, Card, Field, inputCls } from "../../components/ui";
import { getSettings } from "../../../lib/data";

// Só imagens carregadas no backoffice (uuid) entram no carregador;
// as originais (/fundo.png, /ildebranda.jpg) aparecem como "imagem atual".
const uploaded = (ref: string) => (ref && !ref.startsWith("/") ? [ref] : []);

export default async function PaginasAdmin() {
  const s = await getSettings();

  return (
    <>
      <PageHeader title="Textos do site" intro="Tudo o que aparece nas páginas Início, Biografia e Contactos." />

      <AdminForm action={saveSettings} submitLabel="Guardar alterações">
        <Card title="Início">
          <Field label="Imagem da capa" hint="Se remover, volta a imagem original.">
            <ImageUploader name="heroImage" initial={uploaded(s.heroImage)} fallback="/fundo.png" />
          </Field>
          <Field label="Frase de apresentação" htmlFor="heroTagline" hint="Aparece por baixo da imagem da capa. Pode ficar vazia.">
            <input id="heroTagline" name="heroTagline" defaultValue={s.heroTagline} className={inputCls} />
          </Field>
        </Card>

        <Card title="Biografia">
          <Field label="Fotografia">
            <ImageUploader name="bioPhoto" initial={uploaded(s.bioPhoto)} fallback="/ildebranda.jpg" />
          </Field>
          <Field label="Texto" htmlFor="bioText">
            <TextEditor name="bioText" defaultValue={s.bioText} rows={14} />
          </Field>
        </Card>

        <Card title="Contactos e redes sociais">
          <Field label="Texto de introdução" htmlFor="contactIntro">
            <textarea id="contactIntro" name="contactIntro" rows={3} defaultValue={s.contactIntro} className={inputCls} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email" htmlFor="contactEmail">
              <input id="contactEmail" name="contactEmail" type="email" defaultValue={s.contactEmail} className={inputCls} />
            </Field>
            <Field label="Telefone (opcional)" htmlFor="contactPhone">
              <input id="contactPhone" name="contactPhone" type="tel" defaultValue={s.contactPhone} className={inputCls} />
            </Field>
            <Field label="Instagram" htmlFor="instagram" hint="Endereço completo do perfil.">
              <input id="instagram" name="instagram" inputMode="url" defaultValue={s.instagram} className={inputCls} />
            </Field>
            <Field label="Facebook" htmlFor="facebook" hint="Deixe vazio para esconder.">
              <input id="facebook" name="facebook" inputMode="url" defaultValue={s.facebook} className={inputCls} />
            </Field>
          </div>
        </Card>
      </AdminForm>
    </>
  );
}
