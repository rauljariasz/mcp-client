import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@context': '/src/context',
      '@constants': '/src/constants',
      '@pages': '/src/pages',
    },
  },
  build: {
    outDir: 'dist',
  },
  base: 'https://rauljariasz.github.io/mcp-client/',
});
