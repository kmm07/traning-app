import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    target: 'https://thirsty-franklin.85-215-43-232.plesk.page',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
    headers: {
      'Access-Control-Allow-Origin': '*',
      // Add other CORS headers as needed
    },
  },
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths(), react()],
});
