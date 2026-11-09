import "server-only";
import postgres from "postgres";

/**
 * Ligação à base de dados Postgres (Aiven).
 * O URL do Aiven já traz `?sslmode=require`, que é suficiente.
 * Se quiser validar o certificado, cole o "CA certificate" do Aiven
 * na variável DATABASE_CA_CERT.
 */

const globalForDb = globalThis as unknown as { __ildeSql?: postgres.Sql };

export const hasDatabase = Boolean(process.env.DATABASE_URL);

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL não está definido. Veja o README para configurar a base de dados."
    );
  }
  const ca = process.env.DATABASE_CA_CERT;
  return postgres(url, {
    max: 3,
    idle_timeout: 20,
    connect_timeout: 15,
    transform: postgres.camel,
    ...(ca ? { ssl: { ca, rejectUnauthorized: true } } : {}),
  });
}

export function db(): postgres.Sql {
  if (!globalForDb.__ildeSql) globalForDb.__ildeSql = createClient();
  return globalForDb.__ildeSql;
}
