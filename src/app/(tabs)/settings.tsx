import { View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export default function SettingsScreen() {
  const { themed } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      <View style={themed($container)}>
        <Text preset="heading" text="Settings" />
        <Text preset="default" text="Preferences coming soon." />
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})
