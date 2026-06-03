import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,          // 5173 is the portal frontend; 5174 keeps them separate
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8091',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/src/main/resources/static'),
    emptyOutDir: true,
    sourcemap: false,
  },
});
