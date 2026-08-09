// Dominio Inscripcion: tipos propios.
export type EnrollmentStatus = 'idle' | 'submitting' | 'success' | 'error'
export interface EnrollmentForm {
  modalidad: string
  horario: string
  metodoPago: string
  documento: string
}
export interface EnrollmentState {
  courseId: string | null
  courseTitle: string
  step: number
  form: EnrollmentForm
  status: EnrollmentStatus
  error: string | null
}
export type EnrollmentAction =
  | { type: 'OPEN'; courseId: string; courseTitle: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FORM'; field: keyof EnrollmentForm; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' }
