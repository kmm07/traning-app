import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api/admin': {
        target: 'https://thirsty-franklin.85-215-43-232.plesk.page/api/admin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, ''),
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      "cache-control": "no-cache",
    }
  },
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths(), react()],
});
