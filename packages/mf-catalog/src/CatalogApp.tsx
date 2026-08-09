import './tokens.css'
import { useCatalog } from './useStore'
import { catalogStore } from './store'
import { emitEnroll } from './bus'
import type { Course } from './types'

// Ley de Hick: se reduce la carga cognitiva agrupando por categorias.
function categories(courses: Course[]) {
  return ['Todos', ...Array.from(new Set(courses.map((c) => c.category)))]
}

export default function CatalogApp() {
  const courses = useCatalog((s) => s.courses)
  const active = useCatalog((s) => s.activeCategory)
  const visible = active === 'Todos' ? courses : courses.filter((c) => c.category === active)

  return (
    <section style={{ padding: 'var(--space-6)' }}>
      <h2 style={{ marginTop: 0 }}>Catalogo de cursos</h2>
      <p style={{ color: 'var(--neutral-600)', marginTop: 0 }}>
        Microfrontend <strong>Descubrimiento</strong> · equipo autonomo
      </p>

      {/* Filtro por categoria (Ley de Hick) */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-4) 0' }}>
        {categories(courses).map((cat) => (
          <button
            key={cat}
            className={'chip' + (cat === active ? ' active' : '')}
            onClick={() => catalogStore.dispatch({ type: 'SET_CATEGORY', category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tarjetas de curso */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 'var(--space-4)' }}>
        {visible.map((c) => (
          <article key={c.id} className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 12, color: 'var(--primary-500)', fontWeight: 700 }}>{c.category.toUpperCase()}</span>
            <h3 style={{ margin: 0, fontSize: 17 }}>{c.title}</h3>
            <span style={{ color: 'var(--neutral-600)', fontSize: 14 }}>{c.level} · {c.hours} h</span>
            {/* CTA amplio >=44px (Ley de Fitts). Publica un evento de dominio. */}
            <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => emitEnroll({ courseId: c.id, courseTitle: c.title })}>
              Inscribirme
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
