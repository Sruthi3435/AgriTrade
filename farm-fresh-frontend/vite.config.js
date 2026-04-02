import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AgriTrade/',   // ✅ THIS LINE IS CRITICAL
})