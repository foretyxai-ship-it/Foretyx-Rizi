import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081, 
    hmr: {
      overlay: false,
    },
    proxy: {
      // Any request starting with /api is redirected to the Python backend
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
        // This ensures /api/auth/token becomes http://localhost:8000/auth/token
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // This is the "Magic Fix" for the @/data error
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));