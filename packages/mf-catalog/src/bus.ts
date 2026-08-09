// Contrato de integracion entre microfrontends.
// Los MFE NO se importan entre si: se comunican por eventos de dominio
// publicados en window (patron pub/sub). Asi se preserva el bajo
// acoplamiento y la independencia de despliegue.
export const EVENTS = { ENROLL: 'aula-nova:enroll' } as const

export interface EnrollPayload { courseId: string; courseTitle: string }

export function emitEnroll(payload: EnrollPayload) {
  window.dispatchEvent(new CustomEvent(EVENTS.ENROLL, { detail: payload }))
}
