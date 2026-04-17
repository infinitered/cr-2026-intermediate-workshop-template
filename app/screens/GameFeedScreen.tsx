import { useState } from "react"
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { YearSection } from "@/components/YearSection"
import { useGamesByYear } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GameFeedScreen() {
  const { themed, theme } = useAppTheme()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const [showFavorites, setShowFavorites] = useState(false)

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  if (isError || !yearGroups || yearGroups.length === 0) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState heading="There's Nothing Here..." />
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($toggleRow)}>
        <Text text="Show Favorites" />
        <Switch value={showFavorites} onValueChange={setShowFavorites} />
      </View>

      <ScrollView>
        {yearGroups.map((group) => (
          <YearSection key={group.year} year={group.year} games={group.games} />
        ))}
      </ScrollView>
    </Screen>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $toggleRow: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderBottomWidth: 2,
  borderBottomColor: colors.border,
  backgroundColor: colors.background,
})
