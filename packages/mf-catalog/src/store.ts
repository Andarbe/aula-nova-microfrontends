import type { CatalogAction, CatalogState } from './types'
import { courses } from './courses'

// Se conserva el patron Flux de la Entrega 2, pero el store deja de ser
// global y unico: ahora es PROPIO del dominio Catalogo (single source of
// truth acotada). Esto materializa la autonomia del microfrontend.
export const initialState: CatalogState = { courses, activeCategory: 'Todos' }

function reducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category }
    default:
      return state
  }
}

class CatalogStore {
  private state = initialState
  private listeners: Array<() => void> = []
  getState() { return this.state }
  dispatch(action: CatalogAction) {
    this.state = reducer(this.state, action)
    this.listeners.forEach((l) => l())
  }
  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter((l) => l !== listener) }
  }
}
export const catalogStore = new CatalogStore()
