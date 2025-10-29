import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'service-worker': path.resolve(__dirname, 'src/background/service-worker.ts'),
        sidepanel: path.resolve(__dirname, 'src/sidepanel/index.html'),
        options: path.resolve(__dirname, 'src/options/index.html')
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
})