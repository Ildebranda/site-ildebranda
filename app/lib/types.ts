export type WorkStatus = "" | "disponivel" | "vendida" | "colecao";

export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
  "": "",
  disponivel: "Disponível",
  vendida: "Vendida",
  colecao: "Coleção particular",
};

export type Work = {
  id: number;
  title: string;
  category: string;
  year: string;
  technique: string;
  dimensions: string;
  description: string;
  status: WorkStatus;
  images: string[];
  featured: boolean;
  published: boolean;
  position: number;
};

export type ExhibitionKind = "individual" | "coletiva";

export type Exhibition = {
  id: number;
  title: string;
  kind: ExhibitionKind;
  year: string;
  dates: string;
  location: string;
  description: string;
  images: string[];
  link: string;
  published: boolean;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  date: string; // AAAA-MM-DD
  published: boolean;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

export type SiteSettings = {
  heroImage: string;
  heroTagline: string;
  bioPhoto: string;
  bioText: string;
  contactIntro: string;
  contactEmail: string;
  contactPhone: string;
  instagram: string;
  facebook: string;
};
