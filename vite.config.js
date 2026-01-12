// Vite configuration with Tailwind CSS integration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
  },
  css: {
    postcss: './postcss.config.js', // Enable PostCSS processing
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          ui: ['swiper', 'framer-motion', 'aos'],
          utils: ['date-fns', 'lucide-react'],
        },
      },
    },
  },
})
