import './tokens.css'
import { useEffect, useRef, useState } from 'react'

type Domain = 'catalog' | 'enrollment'

// Contrato del evento de dominio publicado por el MFE de Catalogo.
const ENROLL_EVENT = 'aula-nova:enroll'
interface EnrollDetail { courseId: string; courseTitle: string }

export default function App() {
  const [domain, setDomain] = useState<Domain>('catalog')
  const [enrollCourse, setEnrollCourse] = useState<EnrollDetail | null>(null)
  const host = useRef<HTMLDivElement>(null)

  // Comunicacion entre microfrontends: el shell escucha el evento de dominio
  // que emite el Catalogo y enruta hacia el MFE de Inscripcion, sin que los
  // remotos se conozcan entre si (bajo acoplamiento).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<EnrollDetail>).detail
      setEnrollCourse(detail)
      setDomain('enrollment')
    }
    window.addEventListener(ENROLL_EVENT, handler)
    return () => window.removeEventListener(ENROLL_EVENT, handler)
  }, [])

  // Montaje dinamico del microfrontend activo (integracion en tiempo de ejecucion).
  useEffect(() => {
    let cleanup: (() => void) | undefined
    let alive = true
    const container = host.current
    if (!container) return
    container.innerHTML = ''

    ;(async () => {
      if (domain === 'catalog') {
        const { mount } = await import('mf_catalog/mount')
        if (alive) cleanup = mount(container)
      } else {
        const { mount } = await import('mf_enrollment/mount')
        if (alive) cleanup = mount(container, enrollCourse ?? undefined)
      }
    })()

    return () => { alive = false; cleanup?.() }
  }, [domain, enrollCourse])

  return (
    <div>
      <header style={{ background: 'var(--primary-500)', color: '#fff', padding: '0 var(--space-6)',
        height: 60, display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <strong style={{ fontSize: 18 }}>Aula Nova</strong>
        <nav style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className={'chip' + (domain === 'catalog' ? ' active' : '')} onClick={() => setDomain('catalog')}>Catalogo</button>
          <button className={'chip' + (domain === 'enrollment' ? ' active' : '')} onClick={() => setDomain('enrollment')}>Inscripcion</button>
        </nav>
        <span style={{ marginLeft: 'auto', fontSize: 12, opacity: .85 }}>App Shell · host</span>
      </header>

      {/* Punto de montaje del microfrontend remoto activo */}
      <main ref={host} />
    </div>
  )
}
