import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import vercel from "vite-plugin-vercel";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths(), react(), vercel()],
});
