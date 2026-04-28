import { createStore, useStore } from "@/utils/store"

const store = createStore<{ selectedIds: number[] }>({ selectedIds: [] })

export function toggleGenre(id: number) {
  store.setState((prev) => ({
    selectedIds: prev.selectedIds.includes(id)
      ? prev.selectedIds.filter((i) => i !== id)
      : [...prev.selectedIds, id],
  }))
}

export function clearGenres() {
  store.setState({ selectedIds: [] })
}

export function useGenreFilter() {
  const { selectedIds } = useStore(store)
  return {
    selectedIds,
    toggleGenre,
    clearGenres,
    isSelected: (id: number) => selectedIds.includes(id),
  }
}
