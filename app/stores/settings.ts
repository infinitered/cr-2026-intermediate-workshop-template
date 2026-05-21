import { createStore, useStore } from "@/utils/store"

type SortOrder = "Rating" | "Name" | "Release Date"

export interface ShippingAddress {
  street1: string
  street2: string
  city: string
  state: string
  zip: string
}

interface SettingsState {
  displayName: string
  birthDate: string | null
  hideMature: boolean
  minRating: number
  sortOrder: SortOrder
  shippingAddress: ShippingAddress
}

const defaults: SettingsState = {
  displayName: "",
  birthDate: null,
  hideMature: false,
  minRating: 3,
  sortOrder: "Rating",
  shippingAddress: { street1: "", street2: "", city: "", state: "", zip: "" },
}

const store = createStore<SettingsState>(defaults, "settings")

export function resetSettings() {
  store.setState(defaults)
}

export function useSettings() {
  const state = useStore(store)
  return {
    ...state,
    setDisplayName: (displayName: string) => store.setState({ displayName }),
    setBirthDate: (birthDate: string | null) => store.setState({ birthDate }),
    setHideMature: (hideMature: boolean) => store.setState({ hideMature }),
    setMinRating: (minRating: number) => store.setState({ minRating }),
    setSortOrder: (sortOrder: SortOrder) => store.setState({ sortOrder }),
    setShippingAddress: (updates: Partial<ShippingAddress>) =>
      store.setState((prev) => ({
        shippingAddress: { ...prev.shippingAddress, ...updates },
      })),
  }
}
