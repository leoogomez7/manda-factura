import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    ...tanstackStart({
      spa: {
        enabled: true // Esto hace que funcione impecable con vite build
      }
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: new URL("./src", import.meta.url).pathname,
      },
    ],
  },
});
