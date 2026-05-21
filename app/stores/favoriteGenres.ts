import { createStore, useStore } from "@/utils/store"

interface FavoriteGenresState {
  ids: number[]
}

const store = createStore<FavoriteGenresState>({ ids: [] }, "favoriteGenres")

function addFavoriteGenre(id: number) {
  store.setState((prev) => ({
    ids: prev.ids.includes(id) ? prev.ids : [...prev.ids, id],
  }))
}

function removeFavoriteGenre(id: number) {
  store.setState((prev) => ({
    ids: prev.ids.filter((i) => i !== id),
  }))
}

export function useFavoriteGenres() {
  const { ids } = useStore(store)
  return {
    ids,
    addFavoriteGenre,
    removeFavoriteGenre,
    isFavorite: (id: number) => ids.includes(id),
  }
}
