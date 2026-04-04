import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-3d';
          }
          if (id.includes('@uiw/react-md-editor')) {
            return 'vendor-editor';
          }
          if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
            return 'vendor-react';
          }
        }
      }
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
