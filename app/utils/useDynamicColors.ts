import { useSyncExternalStore } from "react"
import { AppState, Platform, useColorScheme } from "react-native"
import { getMaterialColors } from "@expo/ui/jetpack-compose"

let currentPrimary = Platform.OS === "android" ? getMaterialColors().primary : ""
const listeners = new Set<() => void>()

if (Platform.OS === "android") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      const sampled = getMaterialColors().primary
      if (sampled !== currentPrimary) {
        console.log("Material You palette changed, re-rendering app")
        currentPrimary = sampled
        listeners.forEach((l) => l())
      }
    }
  })
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getSnapshot() {
  return currentPrimary
}

/**
 * Ensures the app re-renders when the Material You palette changes
 * (e.g. wallpaper change). `useColorScheme` alone only fires on
 * light/dark toggles. This hook uses `useSyncExternalStore` to
 * guarantee a re-render when the wallpaper-derived palette changes.
 * Returns a `paletteKey` to use as a `key` prop on the root tree.
 */
export function useDynamicColors() {
  const colorScheme = useColorScheme()
  const primarySample = useSyncExternalStore(subscribe, getSnapshot)

  return { colorScheme, paletteKey: `${colorScheme}-${primarySample}` }
}
