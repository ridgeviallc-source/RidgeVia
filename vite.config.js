import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tailwind v4: the Vite plugin, not PostCSS

// public/assets (favicons, mark) is copied to dist/assets untouched. Built files go to dist/static
// so the two never collide.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { assetsDir: 'static' },
})
