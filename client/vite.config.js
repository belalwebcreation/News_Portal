import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/news/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // IMPORTANT: server.js mounts every backend route under "/news/api/...",
      // e.g. app.use("/news/api/auth", authRoutes). The proxy key here must
      // match that exact prefix, or local dev requests to "/news/api/..."
      // won't be forwarded to the backend at all and will 404 (or fall
      // through to Vite's own dev server / SPA handling instead).
      '/news/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})