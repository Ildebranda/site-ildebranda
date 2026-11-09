import { changePassword } from "../../actions";
import { PageHeader } from "../../components/PageHeader";
import { AdminForm, Card, Field, inputCls } from "../../components/ui";
import { requireAdmin } from "../../../lib/auth";

export default async function ContaAdmin() {
  const admin = await requireAdmin();

  return (
    <>
      <PageHeader title="A minha conta" intro={`Entrou como ${admin.email}.`} />

      <AdminForm action={changePassword} submitLabel="Mudar palavra-passe">
        <Card title="Mudar palavra-passe">
          <Field label="Palavra-passe atual" htmlFor="current">
            <input id="current" name="current" type="password" required autoComplete="current-password" className={inputCls} />
          </Field>
          <Field label="Nova palavra-passe" htmlFor="next" hint="Pelo menos 8 caracteres.">
            <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <Field label="Repetir a nova palavra-passe" htmlFor="confirm">
            <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
        </Card>
      </AdminForm>
    </>
  );
}
