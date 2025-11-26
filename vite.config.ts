import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react'; // ← Nécessaire pour React

export default defineConfig({
  plugins: [
    react(), // ← Ajoute le plugin React
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const moduleName = id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0];
            if (
              ['react', 'react-dom', 'firebase', 'lodash', 'recharts'].includes(
                moduleName
              )
            ) {
              return moduleName;
            }
          }
        },
      },
    },
  },
});
