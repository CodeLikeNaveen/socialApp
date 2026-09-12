import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { analyzer } from 'vite-bundle-analyzer';

// https://vite.dev/config/
export default defineConfig({
  build:{
    minify:true,
    cssMinify:true
  },
  plugins: [
    react(),
    tailwindcss(),
    analyzer(),
    
  ],
})
