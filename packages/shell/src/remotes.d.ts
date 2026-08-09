declare module 'mf_catalog/mount' {
  export function mount(container: HTMLElement): () => void
}
declare module 'mf_enrollment/mount' {
  export function mount(
    container: HTMLElement,
    props?: { courseId?: string; courseTitle?: string }
  ): () => void
}
