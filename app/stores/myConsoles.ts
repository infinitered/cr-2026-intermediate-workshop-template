import { createStore, useStore } from "@/utils/store"

interface MyConsolesState {
  ids: string[]
}

const store = createStore<MyConsolesState>({ ids: [] }, "myConsoles")

function addConsole(id: string) {
  store.setState((prev) => ({
    ids: prev.ids.includes(id) ? prev.ids : [...prev.ids, id],
  }))
}

function removeConsole(id: string) {
  store.setState((prev) => ({
    ids: prev.ids.filter((i) => i !== id),
  }))
}

export function useMyConsoles() {
  const { ids } = useStore(store)
  return {
    ids,
    addConsole,
    removeConsole,
    isOwned: (id: string) => ids.includes(id),
  }
}
