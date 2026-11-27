export type CatalogEntry = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  icon: string;
  port?: number;
  localUrl?: string;
  externalUrl?: string;
  sourceUrl?: string;
};

export type Catalog = {
  services: CatalogEntry[];
  projects: CatalogEntry[];
};
