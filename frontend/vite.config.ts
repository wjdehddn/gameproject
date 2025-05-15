import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import history from 'connect-history-api-fallback'
import type { Plugin } from 'vite'

// Vite용 SPA fallback plugin
function spaFallback(): Plugin {
  return {
    name: 'html-spa-fallback',
    configureServer(server) {
      server.middlewares.use(
        // 💡 여기서 as any로 타입 단언해서 타입 오류 회피
        history({
          verbose: false,
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        }) as any
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/ranking': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/game': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})