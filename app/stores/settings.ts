import { createStore, useStore } from "@/utils/store"

type SortOrder = "Rating" | "Name" | "Release Date"

interface SettingsState {
  displayName: string
  hideMature: boolean
  minRating: number
  sortOrder: SortOrder
}

const store = createStore<SettingsState>({
  displayName: "",
  hideMature: false,
  minRating: 3,
  sortOrder: "Rating",
})

export function useSettings() {
  const state = useStore(store)
  return {
    ...state,
    setDisplayName: (displayName: string) => store.setState({ displayName }),
    setHideMature: (hideMature: boolean) => store.setState({ hideMature }),
    setMinRating: (minRating: number) => store.setState({ minRating }),
    setSortOrder: (sortOrder: SortOrder) => store.setState({ sortOrder }),
  }
}
