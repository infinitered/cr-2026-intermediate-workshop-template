import { type FeedGenre, useFeedGenres } from "@/services/api/games"
import { useFavoriteGenres } from "@/stores/favoriteGenres"

export function useFavoriteGenresService() {
  const { data: allGenres = [], isLoading } = useFeedGenres()
  const { ids: favoriteIds, addFavoriteGenre, removeFavoriteGenre, isFavorite } =
    useFavoriteGenres()

  const favoriteGenres = favoriteIds
    .map((id) => allGenres.find((g) => g.id === id))
    .filter(Boolean) as FeedGenre[]

  const otherGenres = allGenres.filter((g) => !favoriteIds.includes(g.id))

  function toggleFavorite(id: number) {
    if (isFavorite(id)) {
      removeFavoriteGenre(id)
    } else {
      addFavoriteGenre(id)
    }
  }

  return {
    favoriteGenres,
    otherGenres,
    isLoading,
    isFavorite,
    toggleFavorite,
  }
}
