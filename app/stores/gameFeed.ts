import { useMemo } from "react"

import { useGamesByYear, type YearGroup } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useGenreFilter } from "@/stores/genreFilter"
import { type SortOrder, useSettings } from "@/stores/settings"

/** Sort options offered by the feed toolbar, in display order. */
export const SORT_OPTIONS: SortOrder[] = ["Name", "Rating", "Release Date"]

const isMature = (game: Game) =>
  game.esrb_rating?.slug === "mature" || game.esrb_rating?.slug === "adults-only"

const compareGames = (a: Game, b: Game, order: SortOrder) => {
  switch (order) {
    case "Name":
      return a.name.localeCompare(b.name)
    case "Rating":
      return a.rating - b.rating
    case "Release Date":
      return (a.released ?? "").localeCompare(b.released ?? "")
  }
}

/**
 * Derived feed selector: takes the raw year groups from the API and applies the
 * current genre filter, mature filter, and sort order/direction from the stores.
 *
 * The feed toolbar only needs to flip store state (`setSortOrder`, `setHideMature`,
 * `toggleGenre`, …) — this hook re-derives the visible groups automatically.
 */
export function useFilteredGamesByYear() {
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { selectedIds: genreIds } = useGenreFilter()
  const { sortOrder, sortAscending, hideMature } = useSettings()

  const groups = useMemo<YearGroup[] | undefined>(() => {
    if (!yearGroups) return yearGroups
    const hasGenreFilter = genreIds.length > 0

    return yearGroups
      .map((group) => {
        let games = group.games
        if (hasGenreFilter) {
          games = games.filter((game) => game.genres.some((g) => genreIds.includes(g.id)))
        }
        if (hideMature) {
          games = games.filter((game) => !isMature(game))
        }
        games = [...games].sort((a, b) => {
          const result = compareGames(a, b, sortOrder)
          return sortAscending ? result : -result
        })
        return { ...group, games }
      })
      .filter((group) => group.games.length > 0)
  }, [yearGroups, genreIds, hideMature, sortOrder, sortAscending])

  return { yearGroups: groups, isLoading, isError }
}
