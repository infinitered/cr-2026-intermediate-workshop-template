import { useQuery } from "@tanstack/react-query"

import { rawgFetch } from "./rawg"
import { Tag, PaginatedResponse } from "./types"

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => rawgFetch<PaginatedResponse<Tag>>("/tags"),
  })
}
