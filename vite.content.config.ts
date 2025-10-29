import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
            input: path.resolve(__dirname, 'src/content/index.tsx'),
            output: {
                entryFileNames: 'content.js',
                format: 'iife',
                inlineDynamicImports: true
            },
            external: []
        },
        cssCodeSplit: false,
        minify: false
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
})