import { defineVitestConfig } from "@nuxt/test-utils/config";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// export default defineVitestConfig(({ mode }) => {
//   // any custom Vitest config you require
//   test: {
//     environment: "nuxt",
//     env: loadEnv(mode, process.cwd(), ""),
//   },
// });

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
