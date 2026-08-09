import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// Microfrontend REMOTO: "Inscripcion / Checkout" (dominio Enrollment).
// Autonomo y desplegable de forma independiente. Expone su mount(container, props).
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mf_enrollment',
      filename: 'remoteEntry.js',
      exposes: { './mount': './src/mount.tsx' },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: { target: 'esnext', modulePreload: false, cssCodeSplit: false },
})
