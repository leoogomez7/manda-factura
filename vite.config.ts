import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    ...tanstackStart(), // <-- Dejalo activo sin la opción "spa", para que maneje el SSR
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
