import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const basePath = process.env.VITE_BASE_PATH || '/'

  const buildOptions = {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    cssMinify: 'esbuild' as const,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild' as const,
    reportCompressedSize: true,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-utils'
          }
          return undefined
        },
      },
    },
  }

  if (mode === 'production') {
    Object.assign(buildOptions, {
      sourcemap: false,
      manifest: true,
    })
  }

  return {
    plugins: [
      checker({ typescript: true }),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        includeAssets: [
          'favicon.svg',
          'favicon-96x96.png',
          'favicon.ico',
          'apple-touch-icon.png',
          'web-app-manifest-192x192.png',
          'web-app-manifest-512x512.png',
          'site.webmanifest',
        ],
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
      }),
      mode === 'production' &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),
    base: basePath,
    publicDir: './public',
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    build: buildOptions,
    optimizeDeps: {
      include: ['date-fns', 'react', 'react-dom', 'react-router-dom'],
    },
    preview: {
      host: 'localhost',
      port: 3000,
    },
  }
})
