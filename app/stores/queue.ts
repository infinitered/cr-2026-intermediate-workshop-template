import { createStore, useStore } from "@/utils/store"

interface QueueState {
  ids: number[]
}

const store = createStore<QueueState>({ ids: [] }, "queue")

export function addToQueue(id: number) {
  store.setState((prev) => ({
    ids: prev.ids.includes(id) ? prev.ids : [...prev.ids, id],
  }))
}

export function removeFromQueue(id: number) {
  store.setState((prev) => ({
    ids: prev.ids.filter((i) => i !== id),
  }))
}

export function moveInQueue(id: number, direction: "up" | "down") {
  store.setState((prev) => {
    const idx = prev.ids.indexOf(id)
    if (idx === -1) return prev
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= prev.ids.length) return prev
    const next = [...prev.ids]
    next[idx] = next[swapIdx]
    next[swapIdx] = id
    return { ids: next }
  })
}

export function reorderQueue(fromIndex: number, toIndex: number) {
  store.setState((prev) => {
    const next = [...prev.ids]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return { ids: next }
  })
}

export function clearQueue() {
  store.setState({ ids: [] })
}

export function isInQueue(id: number): boolean {
  return store.getSnapshot().ids.includes(id)
}

export function useQueue() {
  const { ids } = useStore(store)
  return {
    ids,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    clearQueue,
    isInQueue: (id: number) => ids.includes(id),
  }
}
