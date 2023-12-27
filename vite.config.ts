import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://personaltrainerkmm.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove the '/api' prefix for the proxy request
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
