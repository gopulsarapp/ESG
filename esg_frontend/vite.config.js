import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  server: {
    allowedHosts: [
      'tetratomic-elina-honorifically.ngrok-free.dev'
    ],
  },
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
