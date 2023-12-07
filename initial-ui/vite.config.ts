import { defineConfig, mergeConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default ({ command }) => {
  const isBuild = command === "build";
  
  return defineConfig({
    plugins: [svelte()],
    build: {
      target: "esnext",
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      port: 4000
    },
    resolve: {
      alias: {
        // polyfills
        "readable-stream": "vite-compatible-readable-stream",
        stream: "vite-compatible-readable-stream"
      }
    }
  });
};
