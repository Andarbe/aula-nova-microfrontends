import './tokens.css'
import { useEnrollment } from './useStore'
import { enrollmentStore, submitEnrollment } from './store'

const STEPS = ['Modalidad', 'Horario', 'Pago'] // Ley de Miller: 3 pasos (<= 7 items)

export interface EnrollmentProps {
  courseId?: string
  courseTitle?: string
}

export default function EnrollmentApp({ courseId, courseTitle }: EnrollmentProps) {
  const state = useEnrollment((s) => s)

  // Si el host inyecta un curso (por evento de dominio) y aun no esta abierto, se abre.
  if (courseId && state.courseId !== courseId) {
    enrollmentStore.dispatch({ type: 'OPEN', courseId, courseTitle: courseTitle ?? '' })
  }

  if (!state.courseId) {
    return (
      <section style={{ padding: 'var(--space-6)' }}>
        <h2>Inscripcion</h2>
        <p style={{ color: 'var(--neutral-600)' }}>
          Selecciona un curso en el catalogo para iniciar la inscripcion.
        </p>
      </section>
    )
  }

  const pct = Math.round((state.step / STEPS.length) * 100)

  return (
    <section style={{ padding: 'var(--space-6)', maxWidth: 520 }}>
      <h2 style={{ marginTop: 0 }}>Inscripcion</h2>
      <p style={{ marginTop: 0, color: 'var(--neutral-600)' }}>
        Microfrontend <strong>Inscripcion</strong> · curso: <strong>{state.courseTitle}</strong>
      </p>

      {/* Barra de progreso (Ley de Miller): feedback del avance */}
      <div style={{ background: 'var(--neutral-200)', borderRadius: 999, height: 8, margin: 'var(--space-4) 0' }}>
        <div style={{ width: pct + '%', height: 8, borderRadius: 999, background: 'var(--success-500)', transition: 'width .3s' }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--neutral-600)' }}>Paso {state.step} de {STEPS.length}: {STEPS[state.step - 1]}</p>

      {state.status === 'success' ? (
        <div className="mf-card" style={{ borderColor: 'var(--success-500)' }}>
          <strong style={{ color: 'var(--success-500)' }}>Inscripcion confirmada.</strong>
          <p>Te enviamos los detalles del curso a tu correo.</p>
          <button className="btn btn-ghost" onClick={() => enrollmentStore.dispatch({ type: 'RESET' })}>Nueva inscripcion</button>
        </div>
      ) : (
        <>
          <div className="mf-card" style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {state.step === 1 && (
              <label>Modalidad
                <select className="chip" style={{ width: '100%', height: 'var(--tap-min)' }}
                  value={state.form.modalidad}
                  onChange={(e) => enrollmentStore.dispatch({ type: 'UPDATE_FORM', field: 'modalidad', value: e.target.value })}>
                  <option value="">Selecciona...</option>
                  <option>Virtual en vivo</option>
                  <option>A tu ritmo</option>
                </select>
              </label>
            )}
            {state.step === 2 && (
              <label>Horario
                <select className="chip" style={{ width: '100%', height: 'var(--tap-min)' }}
                  value={state.form.horario}
                  onChange={(e) => enrollmentStore.dispatch({ type: 'UPDATE_FORM', field: 'horario', value: e.target.value })}>
                  <option value="">Selecciona...</option>
                  <option>Manana</option><option>Tarde</option><option>Noche</option>
                </select>
              </label>
            )}
            {state.step === 3 && (
              <label>Metodo de pago
                <select className="chip" style={{ width: '100%', height: 'var(--tap-min)' }}
                  value={state.form.metodoPago}
                  onChange={(e) => enrollmentStore.dispatch({ type: 'UPDATE_FORM', field: 'metodoPago', value: e.target.value })}>
                  <option value="">Selecciona...</option>
                  <option>Tarjeta</option><option>PSE</option>
                </select>
              </label>
            )}
          </div>

          {state.status === 'error' && (
            <p style={{ color: 'var(--danger-500)', fontWeight: 600 }}>{state.error}</p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-ghost" disabled={state.step === 1}
              onClick={() => enrollmentStore.dispatch({ type: 'PREV_STEP' })}>Atras</button>
            {state.step < STEPS.length ? (
              <button className="btn btn-primary" onClick={() => enrollmentStore.dispatch({ type: 'NEXT_STEP' })}>Siguiente</button>
            ) : (
              <button className="btn btn-primary" disabled={state.status === 'submitting'} onClick={() => submitEnrollment()}>
                {state.status === 'submitting' ? 'Enviando...' : 'Confirmar inscripcion'}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
