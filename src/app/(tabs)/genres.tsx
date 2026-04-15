import { View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export default function GenresScreen() {
  const { themed } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      <View style={themed($container)}>
        <Text preset="heading" text="Genres" />
        <Text preset="default" text="Browse by genre coming soon." />
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})
