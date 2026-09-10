import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Don't show overlay errors for files with non-component exports
      include: '**/*.{jsx,tsx}',
    }),
  ],
})
