import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (id.includes('/pages/public/Home')) return 'home'
            if (id.includes('/pages/dashboard/') || id.includes('/pages/admin/')) return 'app-pages'
            return
          }
          if (id.includes('recharts')) return 'charts'
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
