import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect GitHub Pages environment
const isGithub = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  plugins: [react()],
  base: isGithub ? "/Seach-Clothing-and-Printing/" : "/",
  build: {
    outDir: isGithub ? "docs" : "dist",
    sourcemap: false,
    minify: 'terser', // ✅ Use terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // ✅ Remove console.log, console.info
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info'], // Extra safety
      },
      format: {
        comments: false, // Remove comments
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
