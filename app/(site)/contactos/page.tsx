import type { Metadata } from "next";
import { Suspense } from "react";
import { Instagram, Facebook, Phone } from "lucide-react";
import { BrushTitle, PageShell } from "../../components/BrushTitle";
import { ContactForm, ContactFormFromParams } from "../../components/ContactForm";
import { getSettings } from "../../lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Contactos" };

export default async function ContactosPage() {
  const s = await getSettings();

  return (
    <PageShell className="max-w-6xl">
      <BrushTitle>Contactos</BrushTitle>

      <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start">
        <div>
          <p className="font-serif italic text-2xl md:text-3xl text-ink-soft leading-snug">{s.contactIntro}</p>

          {s.contactEmail && (
            <a
              href={`mailto:${s.contactEmail}`}
              className="inline-block mt-10 font-serif text-2xl md:text-3xl text-ultra brush-underline hover:text-rose transition-colors break-all"
            >
              {s.contactEmail}
            </a>
          )}

          <ul className="mt-10 space-y-4 text-ink-soft">
            {s.contactPhone && (
              <li>
                <a href={`tel:${s.contactPhone.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 hover:text-rose">
                  <Phone size={18} strokeWidth={1.5} /> {s.contactPhone}
                </a>
              </li>
            )}
            {s.instagram && (
              <li>
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-rose">
                  <Instagram size={18} strokeWidth={1.5} /> Instagram
                </a>
              </li>
            )}
            {s.facebook && (
              <li>
                <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-rose">
                  <Facebook size={18} strokeWidth={1.5} /> Facebook
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="art-frame !p-8 md:!p-10 rotate-[0.4deg]">
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromParams />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
