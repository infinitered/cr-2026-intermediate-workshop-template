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

export interface FeedGenre {
  id: number
  name: string
  image_background: string | null
  gameCount: number
}

const gamesByYearKey = ["games", "byYear"]

const gamesByYearFn = async (): Promise<YearGroup[]> => {
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
}

export const useGamesByYear = () => {
  return useQuery({ queryKey: gamesByYearKey, queryFn: gamesByYearFn })
}

export const useGamesByGenre = (genreId: number) => {
  return useQuery({
    queryKey: gamesByYearKey,
    queryFn: gamesByYearFn,
    select: (yearGroups): YearGroup[] =>
      yearGroups
        .map((group) => ({
          ...group,
          games: group.games.filter((game) => game.genres.some((g) => g.id === genreId)),
        }))
        .filter((group) => group.games.length > 0),
  })
}

export const useFeedGenres = () => {
  return useQuery({
    queryKey: gamesByYearKey,
    queryFn: gamesByYearFn,
    select: (yearGroups): FeedGenre[] => {
      const genreMap = new Map<number, FeedGenre>()
      for (const group of yearGroups) {
        for (const game of group.games) {
          for (const g of game.genres) {
            const existing = genreMap.get(g.id)
            if (existing) {
              existing.gameCount++
            } else {
              genreMap.set(g.id, {
                id: g.id,
                name: g.name,
                image_background: game.background_image,
                gameCount: 1,
              })
            }
          }
        }
      }
      return Array.from(genreMap.values()).sort((a, b) => a.name.localeCompare(b.name))
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
