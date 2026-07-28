import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useMutedKeywords } from "@/stores/mutedKeywords"
import { useQueue, addToQueue, removeFromQueue, moveInQueue } from "@/stores/queue"

export function useQueueService() {
  const { ids, isInQueue } = useQueue()
  const { keywords: mutedKeywords } = useMutedKeywords()
  const { data: yearGroups = [], isLoading } = useGamesByYear()

  // Build a lookup of all games by ID
  const gamesById = new Map<number, Game>()
  for (const group of yearGroups) {
    for (const game of group.games) {
      gamesById.set(game.id, game)
    }
  }

  const queuedGames = ids.map((id) => gamesById.get(id)).filter(Boolean) as Game[]

  // All games not already in the queue
  const availableGames: Game[] = []
  for (const group of yearGroups) {
    for (const game of group.games) {
      if (!ids.includes(game.id)) {
        availableGames.push(game)
      }
    }
  }

  function chooseNextGame() {
    if (availableGames.length === 0) return
    // Filter out games matching muted keywords
    const unmuted =
      mutedKeywords.length > 0
        ? availableGames.filter(
            (g) => !mutedKeywords.some((kw) => g.name.toLowerCase().includes(kw)),
          )
        : availableGames
    const candidates = unmuted.length > 0 ? unmuted : availableGames
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
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
    queuedGames,
    availableGames,
    isLoading,
    chooseNextGame,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    toggleQueued,
    isInQueue,
  }
}
