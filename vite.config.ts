import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Default ('prompt') leaves a new service worker waiting until every
      // tab of the site is closed and reopened — with no update prompt UI
      // wired up in the app, a deploy would otherwise silently never reach
      // an already-open tab. autoUpdate installs and activates a new
      // version in the background and reloads the page for it.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'freear – Ear Training',
        short_name: 'freear',
        theme_color: '#228be6',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // Workaround so that tabler doesn't import all icons as separate junks
      // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
