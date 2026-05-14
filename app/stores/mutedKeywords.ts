import { createStore, useStore } from "@/utils/store"

interface MutedKeywordsState {
  keywords: string[]
}

const store = createStore<MutedKeywordsState>({ keywords: [] }, "mutedKeywords")

export function addMutedKeyword(keyword: string) {
  const trimmed = keyword.trim().toLowerCase()
  if (!trimmed) return
  store.setState((prev) => ({
    keywords: prev.keywords.includes(trimmed) ? prev.keywords : [...prev.keywords, trimmed],
  }))
}

export function removeMutedKeyword(keyword: string) {
  store.setState((prev) => ({
    keywords: prev.keywords.filter((k) => k !== keyword),
  }))
}

export function useMutedKeywords() {
  const { keywords } = useStore(store)
  return { keywords, addMutedKeyword, removeMutedKeyword }
}
