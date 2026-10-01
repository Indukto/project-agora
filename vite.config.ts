import { vlyPlugin } from "@vly-ai/integrations";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";

// Custom domain at the apex keeps this "/", which is the default and needs no
// configuration. Set BASE_PATH to "/project-agora/" to serve from the github.io
// subpath instead, or to "/anything/" behind a Pages site under a prefix.
const base = process.env.BASE_PATH || "/";

/** Bake the base into the GitHub Pages 404 fallback.
 *
 *  GitHub Pages has no SPA rewrite, so it serves public/404.html for every path
 *  that has no file behind it. That file is copied verbatim, so it cannot read
 *  `base` at runtime — a hardcoded "/" would bounce a "/project-agora/guides"
 *  request off to the domain root. Substituting here keeps both modes working. */
function pagesFallback(): Plugin {
  return {
    name: "pages-fallback",
    writeBundle(options) {
      const file = path.join(options.dir ?? "dist", "404.html");
      if (fs.existsSync(file)) {
        fs.writeFileSync(
          file,
          fs.readFileSync(file, "utf8").replaceAll("__BASE__", base),
        );
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), vlyPlugin(), tailwindcss(), pagesFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Force a single copy of React across all packages (including vlyPlugin).
    // Without this, @vly-ai/integrations can resolve its own React copy, which
    // triggers "Invalid hook call" errors at runtime.
    dedupe: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
  },
  build: {
    // Enable source maps for better debugging (disable in production if needed)
    sourcemap: false,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and lazy loading
        manualChunks: {
          // Vendor chunks for large libraries
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'convex-vendor': ['convex'],
          // Large UI library chunks
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
          ],
          // Heavy optional libraries - separate chunks for better lazy loading
          'framer-motion': ['framer-motion'],
          'charts': ['recharts'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
        // Optimize chunk size
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit for better chunking
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: 'esnext',
    // Minify options - using esbuild (faster than terser)
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    // Only scan the app entry HTML; avoids crawling unrelated *.html files
    // if a legacy snapshot accidentally contains leaked package folders.
    entries: ['index.html'],
    include: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      'react-router',
      '@convex-dev/auth/react',
      'framer-motion',
      // vlyPlugin() injects this import at serve time, so the dep scanner
      // never sees it. Without it here the first page load discovers it,
      // re-optimizes and full-reloads the preview mid-screenshot.
      '@vly-ai/integrations',
    ],
  },
  // Performance hints
  server: { allowedHosts: true,
    // Bind to all interfaces so the browser runtime's server-ready event fires.
    host: true,
    port: 5173,
    // Keep HMR on, but disable full-screen error overlay
    hmr: {
      overlay: false,
    },
  },
});
