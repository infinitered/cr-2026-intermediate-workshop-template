import { useQuery } from "@tanstack/react-query"

import { rawgFetch } from "./rawg"
import { Game, GameDetail, Screenshot, Movie, PaginatedResponse } from "./types"

const GAMES_PER_YEAR = 10
const START_YEAR = 1981
const END_YEAR = 1989

export const useGames = () => {
  return useQuery({
    queryKey: ["games"],
    queryFn: () =>
      rawgFetch<PaginatedResponse<Game>>("/games", {
        page_size: "20",
        ordering: "-released",
      }),
  })
}

export interface YearGroup {
  year: string
  games: Game[]
}

export const useGamesByYear = () => {
  return useQuery({
    queryKey: ["games", "byYear"],
    queryFn: async (): Promise<YearGroup[]> => {
      const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i)
      const results = await Promise.all(
        years.map(async (y) => {
          const data = await rawgFetch<PaginatedResponse<Game>>("/games", {
            page_size: String(GAMES_PER_YEAR),
            ordering: "-rating",
            dates: `${y}-01-01,${y}-12-31`,
          })
          return { year: String(y), games: data.results }
        }),
      )
      return results.filter((group) => group.games.length > 0)
    },
  })
}

export const useGameDetail = (id: number) => {
  return useQuery({
    queryKey: ["games", id],
    queryFn: () => rawgFetch<GameDetail>(`/games/${id}`),
    enabled: !!id,
  })
}

export const useGameScreenshots = (gameId: number) => {
  return useQuery({
    queryKey: ["games", gameId, "screenshots"],
    queryFn: () => rawgFetch<PaginatedResponse<Screenshot>>(`/games/${gameId}/screenshots`),
    enabled: !!gameId,
  })
}

export const useGameMovies = (gameId: number) => {
  return useQuery({
    queryKey: ["games", gameId, "movies"],
    queryFn: () => rawgFetch<PaginatedResponse<Movie>>(`/games/${gameId}/movies`),
    enabled: !!gameId,
  })
}

export const useGameSeries = (gameId: number) => {
  return useQuery({
    queryKey: ["games", gameId, "game-series"],
    queryFn: () => rawgFetch<PaginatedResponse<Game>>(`/games/${gameId}/game-series`),
    enabled: !!gameId,
  })
}
