import type { Metadata } from "next";
import AdminNav from "../components/AdminNav";
import { requireAdmin } from "../../lib/auth";
import { getUnreadCount } from "../../lib/data";

export const metadata: Metadata = {
  title: "Backoffice",
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const unread = await getUnreadCount();

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav unread={unread} name={admin.name} />
      <main className="md:pl-64">
        <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-10">{children}</div>
      </main>
    </div>
  );
}
