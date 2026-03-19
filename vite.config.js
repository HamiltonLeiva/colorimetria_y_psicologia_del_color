import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Asegura que los activos se carguen correctamente en subcarpetas de GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generar nombres de archivos consistentes para facilitar el debugging en producción
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
