import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Redirect ALL Vite internal operations to a writable directory
  cacheDir: '/tmp/.vite',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
