import { ActivityIndicator, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { useAppTheme } from "@/theme/context"

export function LoadingScreen() {
  const { theme } = useAppTheme()

  return (
    <Screen preset="fixed" contentContainerStyle={$centered}>
      <ActivityIndicator size="large" color={theme.colors.tint} />
    </Screen>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
