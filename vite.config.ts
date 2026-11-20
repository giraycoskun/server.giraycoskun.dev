import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { getNetworkInfo } from "./src/server/network-info.ts";

// https://vite.dev/config/
export default defineConfig({
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
})
