import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.tsx'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
        options: resolve(__dirname, 'src/options/index.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name === 'service-worker') return 'service-worker.js';
          if (name === 'content') return 'content.js';
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
})