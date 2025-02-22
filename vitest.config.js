import { defineVitestConfig } from "@nuxt/test-utils/config";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue"; // Importez le plugin Vue

export default defineConfig(({ mode }) => ({
  plugins: [vue()], // Ajoutez le plugin Vue ici
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    environment: "happy-dom", // ou "jsdom" pour simuler un environnement DOM
    globals: true, // Active les APIs globales de Vitest (comme `describe`, `it`, etc.)
  },
}));
