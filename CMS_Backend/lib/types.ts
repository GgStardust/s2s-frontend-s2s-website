export interface Orb {
  id: number;
  title: string;
  slug: string;
  synthesis: string;
}

export interface Module {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
}

export interface PublicCodex {
  orbs: Orb[];
  modules: Module[];
  scrollstream: string[];
}
