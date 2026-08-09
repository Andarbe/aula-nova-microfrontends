import { useSyncExternalStore } from 'react'
import { enrollmentStore } from './store'
import type { EnrollmentState } from './types'
const subscribe = (cb: () => void) => enrollmentStore.subscribe(cb)
export function useEnrollment<T>(selector: (s: EnrollmentState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(enrollmentStore.getState()))
}
