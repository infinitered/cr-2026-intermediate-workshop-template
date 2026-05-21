import type { Game } from "@/services/api/types"
import { useFavoriteGenres } from "@/stores/favoriteGenres"
import { useMutedKeywords } from "@/stores/mutedKeywords"
import { useQueue, addToQueue, removeFromQueue } from "@/stores/queue"

export function useQueueService() {
  const { ids, isInQueue } = useQueue()
  const { ids: favoriteGenreIds } = useFavoriteGenres()
  const { keywords: mutedKeywords } = useMutedKeywords()

  function chooseNextGame(availableGames: Game[]) {
    if (availableGames.length === 0) return
    // Filter out games matching muted keywords
    const unmuted =
      mutedKeywords.length > 0
        ? availableGames.filter(
            (g) => !mutedKeywords.some((kw) => g.name.toLowerCase().includes(kw)),
          )
        : availableGames
    const candidates = unmuted.length > 0 ? unmuted : availableGames
    // Prefer games matching favorite genres when available
    const preferred =
      favoriteGenreIds.length > 0
        ? candidates.filter((g) => g.genres.some((genre) => favoriteGenreIds.includes(genre.id)))
        : []
    const pool = preferred.length > 0 ? preferred : candidates
    const pick = pool[Math.floor(Math.random() * pool.length)]
    addToQueue(pick.id)
  }

  function toggleQueued(id: number) {
    if (isInQueue(id)) {
      removeFromQueue(id)
    } else {
      addToQueue(id)
    }
  }

  return {
    queueIds: ids,
    chooseNextGame,
    addToQueue,
    removeFromQueue,
    toggleQueued,
    isInQueue,
  }
}
