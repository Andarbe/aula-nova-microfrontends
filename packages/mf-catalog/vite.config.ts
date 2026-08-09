import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Microfrontend REMOTO: "Descubrimiento de cursos" (dominio Catalogo).
// Expone su punto de montaje (mount) para que el shell (host) lo integre
// en tiempo de ejecucion. Puede desplegarse y ejecutarse de forma autonoma.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mf_catalog',
      filename: 'remoteEntry.js',
      exposes: { './mount': './src/mount.tsx' },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: { target: 'esnext', modulePreload: false, cssCodeSplit: false },
})
