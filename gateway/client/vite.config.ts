import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), vueJsx()],
    server: {
      port: 8089,
      host: true,
      proxy: {
        "^/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
