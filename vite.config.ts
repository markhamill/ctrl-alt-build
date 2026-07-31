import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // This must match your GitHub repository name exactly, with leading and trailing slashes
  base: '/ctrl-alt-build/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
