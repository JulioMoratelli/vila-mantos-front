import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.PORT ?? 8080),
    hmr: {
      overlay: false,
    },
    allowedHosts: [
      "credari-vila-mantos-front.thegkr.easypanel.host",
      "vilamantos.com.br",
      "www.vilamantos.com.br",
    ],
  },
  preview: {
    host: true,
    port: Number(process.env.PORT ?? 8080),
    allowedHosts: [
      "credari-vila-mantos-front.thegkr.easypanel.host",
      "vilamantos.com.br",
      "www.vilamantos.com.br",
    ],
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
