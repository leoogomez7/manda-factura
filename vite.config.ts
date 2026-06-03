import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';



export default defineConfig({
  plugins: [
    ...cloudflare({ viteEnvironment: { name: 'ssr' } }),
    ...tanstackStart(),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  optimizeDeps: {
    noDiscovery: true,
    include: [],
    exclude: [
      "@tanstack/react-start",
      "@tanstack/react-router",
      "@tanstack/start-server-core",
      "@tanstack/start-client-core",
      "@tanstack/react-start-server",
    ],
  },
  ssr: {
    noExternal: [
      "@tanstack/react-start",
      "@tanstack/react-router",
      "@tanstack/start-server-core",
      "@tanstack/start-client-core",
      "@tanstack/react-start-server",
    ],
  },
  resolve: {
    alias: [{ find: "@", replacement: new URL("./src", import.meta.url).pathname }],
    dedupe: ["react", "react-dom", "@tanstack/react-start"],
  },
});
