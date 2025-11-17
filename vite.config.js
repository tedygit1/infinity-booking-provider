// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 🔥 PROXY SETUP — DEV ONLY (production uses real domain)
  // vite.config.js
// vite.config.js
server: {
  port: 5173,
  host: '0.0.0.0',
  proxy: {
  '/api': {
    target: 'https://infinity-booking-backend1.onrender.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => {
      const rewritten = path.replace(/^\/api/, '/infinity-booking');
      console.log('🔁 Proxy rewrite:', path, '→', rewritten);
      return rewritten;
    },
  },
},

  // Optional: build config for production
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}
});