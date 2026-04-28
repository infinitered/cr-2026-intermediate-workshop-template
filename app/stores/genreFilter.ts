import { createStore, useStore } from "@/utils/store"

interface GenreFilterState {
  selectedIds: number[]
}

const DEFAULT_GENRE_IDS = [4, 83, 5] // Action, Platformer, RPG

const store = createStore<GenreFilterState>({ selectedIds: DEFAULT_GENRE_IDS }, "genreFilter")

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
