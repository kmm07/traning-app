import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api/admin': {
        target: 'http://personaltrainerkmm.com/',
        changeOrigin: true,
        secure : false
      },
    },
    headers : {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: {
    outDir: "build"
  },
  plugins: [tsconfigPaths(), react()],
});
