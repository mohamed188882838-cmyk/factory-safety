import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://72.62.186.142:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
