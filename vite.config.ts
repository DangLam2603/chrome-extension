import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const isContentScript = process.env.BUILD_TARGET === 'content'

  if (isContentScript) {
    // Special build configuration for content script
    return {
      plugins: [react()],
      base: './',
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'src/content/index.tsx'),
          name: 'ChromeExtensionContent',
          fileName: 'content',
          formats: ['iife']
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {},
            assetFileNames: 'content.css'
          }
        },
        cssCodeSplit: false
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }
  }

  // Default build configuration for other files
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
          sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
          options: resolve(__dirname, 'src/options/index.html')
        },
        output: {
          entryFileNames: (chunkInfo) => {
            const name = chunkInfo.name;
            if (name === 'service-worker') return 'service-worker.js';
            return `${name}.js`;
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'content.css';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },
      cssCodeSplit: false
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    }
  }
})