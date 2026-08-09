import { createRoot, type Root } from 'react-dom/client'
import CatalogApp from './CatalogApp'

// Contrato de integracion framework-agnostico: el host recibe una funcion
// mount(container) y una funcion de limpieza (unmount). El host no necesita
// conocer que internamente es React.
export function mount(container: HTMLElement): () => void {
  const root: Root = createRoot(container)
  root.render(<CatalogApp />)
  return () => root.unmount()
}
