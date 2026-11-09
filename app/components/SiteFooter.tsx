import { SocialLinks } from "./SiteNav";

export default function SiteFooter(props: { instagram: string; facebook: string; email: string }) {
  return (
    <footer className="mt-24 px-6 md:px-12 lg:px-16 py-10 border-t border-paper-3/70 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-ink-mute">
      <p>
        <span className="font-brush text-xl text-ultra mr-2">Ildebranda Martins</span>©{" "}
        {new Date().getFullYear()}
      </p>
      <SocialLinks {...props} className="text-ink-soft" />
    </footer>
  );
}
