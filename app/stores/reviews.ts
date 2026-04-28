import { createStore, useStore } from "@/utils/store"

export interface Review {
  id: string
  text: string
  rating: number
  createdAt: string
}

interface ReviewsState {
  byGameId: Record<string, Review[]>
}

const store = createStore<ReviewsState>({ byGameId: {} }, "reviews")

export function addReview(gameId: number, text: string, rating: number) {
  store.setState((prev) => {
    const key = String(gameId)
    const existing = prev.byGameId[key] ?? []
    const review: Review = {
      id: `${gameId}-${Date.now()}`,
      text,
      rating,
      createdAt: new Date().toISOString(),
    }
    return { byGameId: { ...prev.byGameId, [key]: [review, ...existing] } }
  })
}

export function updateReview(gameId: number, reviewId: string, text: string, rating: number) {
  store.setState((prev) => {
    const key = String(gameId)
    const existing = prev.byGameId[key] ?? []
    return {
      byGameId: {
        ...prev.byGameId,
        [key]: existing.map((r) => (r.id === reviewId ? { ...r, text, rating } : r)),
      },
    }
  })
}

export function deleteReview(gameId: number, reviewId: string) {
  store.setState((prev) => {
    const key = String(gameId)
    const existing = prev.byGameId[key] ?? []
    return {
      byGameId: {
        ...prev.byGameId,
        [key]: existing.filter((r) => r.id !== reviewId),
      },
    }
  })
}

export function useReviews(gameId: number) {
  const { byGameId } = useStore(store)
  return byGameId[String(gameId)] ?? []
}
