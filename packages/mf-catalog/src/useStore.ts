import { useSyncExternalStore } from 'react'
import { catalogStore } from './store'
import type { CatalogState } from './types'
const subscribe = (cb: () => void) => catalogStore.subscribe(cb)
export function useCatalog<T>(selector: (s: CatalogState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(catalogStore.getState()))
}
