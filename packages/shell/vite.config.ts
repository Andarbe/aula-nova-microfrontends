import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// HOST (App Shell): orquesta y compone los microfrontends remotos en
// tiempo de ejecucion (composicion en cliente con Module Federation).
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        mf_catalog: 'http://localhost:5001/assets/remoteEntry.js',
        mf_enrollment: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: { target: 'esnext', modulePreload: false, cssCodeSplit: false },
})
