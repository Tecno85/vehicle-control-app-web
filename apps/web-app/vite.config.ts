import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // core-service solo acepta peticiones del navegador desde este origen exacto (CORS); por eso el puerto no cambia.
  server: { port: 5173, strictPort: true },
})
