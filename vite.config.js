import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tailwind v4: the Vite plugin, not PostCSS

// Adds a preload for each face used above the fold (headline, nav, wordmark) so the browser fetches them
// with the HTML instead of after the script runs. Geist Mono only appears inside the demo, so it is left out.
const ABOVE_THE_FOLD = ['mona-sans-latin', 'geist-latin', 'urbanist-latin', 'caveat-latin']
const preloadFonts = () => ({
  name: 'preload-fonts',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return
      return Object.keys(ctx.bundle)
        .filter((file) => file.endsWith('.woff2') && ABOVE_THE_FOLD.some((name) => file.includes(name)))
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
          injectTo: 'head-prepend',
        }))
    },
  },
})

// public/assets (favicons, mark) is copied to dist/assets untouched. Built files go to dist/static
// so the two never collide.
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: { assetsDir: 'static' },
})
