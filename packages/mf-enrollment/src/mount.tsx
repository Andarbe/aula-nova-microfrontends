import { createRoot, type Root } from 'react-dom/client'
import EnrollmentApp, { type EnrollmentProps } from './EnrollmentApp'

// Contrato de integracion: mount(container, props) -> unmount.
export function mount(container: HTMLElement, props: EnrollmentProps = {}): () => void {
  const root: Root = createRoot(container)
  root.render(<EnrollmentApp {...props} />)
  return () => root.unmount()
}
