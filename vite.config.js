// vite.config.js - Configuration ILN Frontend Build
// Essence compile!() optimisation maximale

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Configuration ILN pour performance maximale
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    
    // Essence ptr!() - Optimisation bundle
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    
    // Essence cache!() - Optimisation assets
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    
    // Performance targets ILN
    target: 'es2020',
    cssCodeSplit: true
  },
  
  // Dev server configuration
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/generate': 'http://localhost:8000',
      '/analytics': 'http://localhost:8000',
      '/strength': 'http://localhost:8000',
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  },
  
  // Optimisations ILN
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  
  define: {
    __ILN_VERSION__: JSON.stringify('1.0.0'),
    __ILN_ESSENCES__: JSON.stringify(['compile!', 'event!', 'cache!', 'vdom!'])
  }
})