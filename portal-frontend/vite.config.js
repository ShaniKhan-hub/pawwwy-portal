import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Proxy API calls to the Spring Boot backend during local dev.
    // Backend runs on 8090 (see portal-backend/src/main/resources/application.properties).
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
  // Production build is emitted directly into the Spring Boot static-resources
  // directory so a single `mvn package` ships frontend + backend together.
  build: {
    outDir: path.resolve(__dirname, '../portal-backend/src/main/resources/static'),
    emptyOutDir: true,
    sourcemap: false,
  },
});
