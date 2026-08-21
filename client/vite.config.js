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
      '/news/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // ✅ NEW — Socket.io WebSocket upgrade dev-এ proxy করার জন্য।
      // ws: true না দিলে dev-এ শুধু polling-এই আটকে থাকবে।
      '/news/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})