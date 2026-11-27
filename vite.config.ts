import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { getNetworkInfo } from "./src/server/network-info.ts";
import catalog from "./src/data/catalog.json";
import type { CatalogEntry } from "./src/data/catalog.ts";

function publicEntry(entry: CatalogEntry) {
  const result = { ...entry };
  delete result.localUrl;
  if (!result.externalUrl) {
    delete result.port;
    delete result.sourceUrl;
  }
  return result;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_ENV } = loadEnv(mode, process.cwd(), "VITE_");
  const appCatalog = VITE_ENV === "external"
    ? {
        services: catalog.services.map(publicEntry),
        projects: catalog.projects.map(publicEntry),
      }
    : catalog;

  return {
    define: { __APP_CATALOG__: JSON.stringify(appCatalog) },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "server-network-snapshot",
        apply: "build",
        async generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "network-info.json",
            source: JSON.stringify(await getNetworkInfo()),
          });
        },
      },
    ],
  };
});
