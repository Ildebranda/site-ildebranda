export default function AdminPage() {
  return (
    <html lang="pt">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Painel de Gestão - Ildebranda Martins</title>
        {/* Script do CMS */}
        <script
          src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"
          defer
        />
      </head>
      <body>{/* O Decap CMS injeta o painel aqui automaticamente */}</body>
    </html>
  );
}
