import { createStore, useStore } from "@/utils/store"

const store = createStore<{ ids: number[] }>({ ids: [] }, "favorites")

export function toggleFavorite(id: number) {
  store.setState((prev) => ({
    ids: prev.ids.includes(id) ? prev.ids.filter((i) => i !== id) : [...prev.ids, id],
  }))
}

export function clearFavorites() {
  store.setState({ ids: [] })
}

export function isFavorite(id: number): boolean {
  return store.getSnapshot().ids.includes(id)
}

export function useFavorites() {
  const { ids } = useStore(store)
  return { ids, toggleFavorite, clearFavorites, isFavorite: (id: number) => ids.includes(id) }
}
