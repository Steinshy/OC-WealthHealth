import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'node:path';

export const appPublicBasePath = process.env.VITE_BASE_PATH || '/';
export default defineConfig(({ mode }) => {
  const basePath = appPublicBasePath;

  const buildOptions = {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    cssMinify: 'lightningcss' as const,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'oxc' as const,
    reportCompressedSize: true,
    modulePreload: {
      polyfill: false,
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|react-router)[\\/]/,
              priority: 2,
            },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 1 },
          ],
        },
      },
    },
  };

  if (mode === 'production') {
    Object.assign(buildOptions, {
      manifest: true,
    });
  }

  return {
    server: {
      port: 5173,
      strictPort: true,
      open: false,
    },
    oxc: {
      jsx: { runtime: 'automatic' },
    },
    plugins: [
      mode !== 'production' && checker({ typescript: true }),
      react(),
      mode === 'production' &&
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    base: basePath,
    publicDir: './public',
    build: buildOptions,
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router'],
    },
    preview: {
      host: 'localhost',
      port: 3000,
    },
  };
});
