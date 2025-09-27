import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // 🆕 GitHub Pages base path
  base: '/Resume---building-platform/',
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 🆕 Ensure assets are properly referenced
    assetsDir: 'assets',
  },
  
  // 🆕 Environment-specific configuration
  define: {
    __IS_GITHUB_PAGES__: JSON.stringify(process.env.NODE_ENV === 'production'),
  }
})
