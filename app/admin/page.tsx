"use client";

import Script from "next/script";

export default function AdminPage() {
  return (
    <>
      <div id="nc-root" />
      <Script
        src="https://unpkg.com/decap-cms@3.3.0/dist/decap-cms.js"
        strategy="afterInteractive"
      />
    </>
  );
}
