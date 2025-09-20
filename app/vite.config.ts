import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Ensure assets resolve correctly when served under /<repo>/ on GitHub Pages
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'Trakkly',
        short_name: 'Trakkly',
        description: 'Offline-first personal counters with privacy.',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '.',
        start_url: '.',
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          // maskable icons can be added later with PNGs for better Android support
        ],
      },
    }),
  ],
})
