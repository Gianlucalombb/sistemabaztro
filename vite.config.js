import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Baztro Sistema',
        short_name: 'Baztro',
        description: 'Sistema de gestión mayorista Baztro',
        theme_color: '#1a1a1a',
        background_color: '#e8e5e0',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo.ico',
            sizes: '192x192',
            type: 'image/ico',
          },
          {
            src: '/logo.ico',
            sizes: '512x512',
            type: 'image/ico',
          },
        ],
      },
    }),
  ],
})