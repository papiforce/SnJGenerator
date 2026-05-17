import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// `base` peut être surchargé pour un déploiement GitHub Pages en sous-chemin
// (ex: SNJ_BASE=/SnJGenerator/). Par défaut: racine.
const base = process.env.SNJ_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
