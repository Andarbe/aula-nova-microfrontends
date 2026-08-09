import type { EnrollmentAction, EnrollmentForm, EnrollmentState } from './types'

const emptyForm: EnrollmentForm = { modalidad: '', horario: '', metodoPago: '', documento: '' }
export const initialState: EnrollmentState = {
  courseId: null, courseTitle: '', step: 1, form: { ...emptyForm }, status: 'idle', error: null,
}

// Reducer puro del dominio (patron Flux, Entrega 2).
function reducer(state: EnrollmentState, action: EnrollmentAction): EnrollmentState {
  switch (action.type) {
    case 'OPEN':
      return { ...initialState, courseId: action.courseId, courseTitle: action.courseTitle, form: { ...emptyForm } }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, [action.field]: action.value } }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success' }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'RESET':
      return { ...initialState, form: { ...emptyForm } }
    default:
      return state
  }
}

class EnrollmentStore {
  private state = initialState
  private listeners: Array<() => void> = []
  getState() { return this.state }
  dispatch(action: EnrollmentAction) {
    this.state = reducer(this.state, action)
    this.listeners.forEach((l) => l())
  }
  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter((l) => l !== listener) }
  }
}
export const enrollmentStore = new EnrollmentStore()

// Accion asincrona con manejo de error (heredada de la Entrega 2).
export async function submitEnrollment(): Promise<void> {
  enrollmentStore.dispatch({ type: 'SUBMIT_START' })
  try {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => (Math.random() > 0.15 ? resolve() : reject(new Error('network'))), 900)
    })
    enrollmentStore.dispatch({ type: 'SUBMIT_SUCCESS' })
  } catch {
    enrollmentStore.dispatch({ type: 'SUBMIT_ERROR', error: 'No se pudo completar la inscripcion. Intenta de nuevo.' })
  }
}
