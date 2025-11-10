import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['reserchaai.onrender.com', 'localhost', '127.0.0.1', '0.0.0.0'],
  },
})
