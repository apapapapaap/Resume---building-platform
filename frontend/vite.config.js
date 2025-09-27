import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Use different base paths for development vs build
  const base = command === 'build' && mode === 'production' 
    ? '/Resume---building-platform/' 
    : '/';

  return {
    plugins: [react()],
    
    // Environment-specific base path
    base: base,
    
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
      assetsDir: 'assets',
    },
    
    define: {
      __IS_GITHUB_PAGES__: JSON.stringify(mode === 'production'),
    }
  }
})
