import { useQuery } from "@tanstack/react-query"

import { rawgFetch } from "./rawg"
import { Game, GameDetail, Screenshot, Movie, PaginatedResponse } from "./types"

export const useGames = () => {
  return useQuery({
    queryKey: ["games"],
    queryFn: () => rawgFetch<PaginatedResponse<Game>>("/games", { page_size: "20" }),
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
