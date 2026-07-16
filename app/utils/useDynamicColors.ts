import { useEffect, useState } from "react"
import { AppState, Platform, useColorScheme } from "react-native"
import { getMaterialColors, type MaterialColors } from "@expo/ui/jetpack-compose"

/**
 * Returns the resolved Material 3 color palette and re-renders when
 * the palette changes (e.g. wallpaper change). On non-Android platforms,
 * returns `null` for colors.
 */
export function useDynamicColors() {
  const colorScheme = useColorScheme()

  const [colors, setColors] = useState<MaterialColors | null>(() =>
    Platform.OS === "android" ? getMaterialColors() : null,
  )

  useEffect(() => {
    if (Platform.OS !== "android") return

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const current = getMaterialColors()
        setColors((prev) => {
          if (prev && prev.primary === current.primary) return prev
          return current
        })
      }
    })
    return () => sub.remove()
  }, [])

  return { colorScheme, colors }
}
