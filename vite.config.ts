import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    splitVendorChunkPlugin(),
    checker({
      typescript: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        chunkFileNames: () => "[hash].js",
      },
    },
  },
  server: {
    port: 3000,
    hmr: true,
    host: "0.0.0.0",
  },
});
