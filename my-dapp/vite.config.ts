import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    global: {},
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer",
      stream: "stream-browserify",
      util: "util",
    },
  },
});
