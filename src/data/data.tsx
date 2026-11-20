type Service = {
  id: number;
  category?: string;
  title: string;
  description?: string;
  external?: string;
  url: string;
  status?: string;
  icon?: string;
  port: number;
};

type ServicesData = {
  services: Service[];
};

type Project = {
  id: number;
  title: string;
  description?: string;
  external?: string;
  url: string;
  status?: string;
  icon?: string;
  category?: string;
  port?: number;
};

type ProjectsData = {
  projects: Project[];
};

type AppData = ServicesData & ProjectsData;

export const isExternalBuild = import.meta.env.VITE_ENV === "external";
const { default: data }: { default: AppData } = isExternalBuild
  ? await import("./data-external.json")
  : await import("./data-local.json");

const localHost = isExternalBuild
  ? ""
  : import.meta.env.VITE_LOCAL_HOST?.trim() || window.location.hostname;

function resolveUrl<T extends { url: string }>(entry: T): T {
  const url = entry.url.startsWith("/")
    ? new URL(entry.url, window.location.origin).href
    : entry.url.replace("{host}", localHost);
  return { ...entry, url };
}

const appData: AppData = {
  services: data.services.map(resolveUrl),
  projects: data.projects.map(resolveUrl),
};

export type { Service, Project, AppData };
export default appData;
