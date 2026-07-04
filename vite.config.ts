import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Project-page path for GitHub Pages (repo: the-long-game). Harmless for
  // local dev and for hosts serving from the domain root (e.g. Vercel).
  base: process.env.GITHUB_PAGES ? '/the-long-game/' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
})
