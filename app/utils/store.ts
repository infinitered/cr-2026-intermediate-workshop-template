import { useSyncExternalStore } from "react"

import { load, save } from "@/utils/storage"

export interface Store<T> {
  getSnapshot: () => T
  subscribe: (listener: () => void) => () => void
  setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => void
}

export function createStore<T>(initialState: T, persistKey?: string): Store<T> {
  let state = initialState
  if (persistKey) {
    try {
      const persisted = load<Partial<T>>(persistKey)
      if (persisted && typeof persisted === "object" && !Array.isArray(persisted)) {
        state = { ...initialState, ...persisted }
      }
    } catch {
      save(persistKey, initialState)
    }
  }
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
        Object.keys(next as object).every((k) => Object.is((state as any)[k], (merged as any)[k]))
      )
        return
      state = merged
      if (persistKey) save(persistKey, state)
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
