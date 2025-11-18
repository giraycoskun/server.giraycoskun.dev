type Service = {
  id: number;
  title: string;
  description?: string;
  url: string;
  status?: string;
  icon?: string;
};

type ServicesData = {
  services: Service[];
};

type Project = {
  id: number;
  title: string;
  description?: string;
  url: string;
  status?: string;
  icon?: string;
};

type ProjectsData = {
  projects: Project[];
};

type AppData = ServicesData & ProjectsData;

const env = import.meta.env.VITE_ENV;

/**
 * Try to load ./config.<env>.json, fallback to ./local.json on error.
 * Uses top-level await like the original JS file to keep the default export synchronous for importers.
 */
let appData: AppData;

try {
  const mod = await import(`./data-${env}.json`);
  appData = (mod && (mod.default ?? mod)) as AppData;
} catch (error) {
  console.error(`Failed to load config for environment: ${env}`, error);
  const fallback = await import('./data-local.json');
  appData = (fallback && (fallback.default ?? fallback)) as AppData;
}

export default appData;