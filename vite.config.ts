import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// const target = "https://personaltrainerkmm.com/api/admin";
// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  server: {
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths(), react()],
});
