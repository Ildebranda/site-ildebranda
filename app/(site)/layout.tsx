import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { getSettings } from "../lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const social = { instagram: s.instagram, facebook: s.facebook, email: s.contactEmail };

  return (
    <div className="paper-grain min-h-screen">
      <div className="watercolor-wash" aria-hidden />
      <SiteNav {...social} />
      <div className="relative z-10 lg:pl-64 min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter {...social} />
      </div>
    </div>
  );
}
