import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    vue(),
    viteSitemap({
      outDir: 'dist',
      filename: 'sitemap.xml',
    })
  ],
  server: {
    host: true,
    proxy: {
      '/api/jjs-gold': {
        target: 'http://211.170.168.146:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jjs-gold/, '/jjs-gold')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})