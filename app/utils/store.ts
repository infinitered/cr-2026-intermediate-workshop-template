import { useSyncExternalStore } from "react"

export interface Store<T> {
  getSnapshot: () => T
  subscribe: (listener: () => void) => () => void
  setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => void
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setState: (partial) => {
      const next = typeof partial === "function" ? partial(state) : partial
      const merged = { ...state, ...next }
      if (
        Object.keys(next as object).every((k) =>
          Object.is((state as any)[k], (merged as any)[k]),
        )
      )
        return
      state = merged
      listeners.forEach((l) => l())
    },
  }
}

export function useStore<T>(store: Store<T>): T
export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S
export function useStore<T>(store: Store<T>, selector?: (state: T) => unknown) {
  return useSyncExternalStore(
    store.subscribe,
    selector ? () => selector(store.getSnapshot()) : store.getSnapshot,
  )
}
