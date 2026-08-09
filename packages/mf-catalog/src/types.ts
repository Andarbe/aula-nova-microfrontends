// Dominio Catalogo: tipos propios (autonomia del microfrontend).
export interface Course {
  id: string
  title: string
  category: string
  level: string
  hours: number
}
export interface CatalogState {
  courses: Course[]
  activeCategory: string
}
export type CatalogAction =
  | { type: 'SET_CATEGORY'; category: string }
