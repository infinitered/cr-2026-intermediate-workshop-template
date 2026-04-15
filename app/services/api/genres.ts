import { useQuery } from "@tanstack/react-query"

import { rawgFetch } from "./rawg"
import { Genre, PaginatedResponse } from "./types"

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => rawgFetch<PaginatedResponse<Genre>>("/genres"),
  })
}
