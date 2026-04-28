import { useMemo, useState } from "react"
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { YearSection } from "@/components/YearSection"
import { useGamesByYear } from "@/services/api/games"
import { useFavorites } from "@/stores/favorites"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GameFeedScreen() {
  const { themed, theme } = useAppTheme()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const [showFavorites, setShowFavorites] = useState(false)
  const { ids: favoriteIds } = useFavorites()
  const { selectedIds: genreIds } = useGenreFilter()

  const filteredYearGroups = useMemo(() => {
    if (!yearGroups) return yearGroups
    const hasGenreFilter = genreIds.length > 0
    const hasFavFilter = showFavorites

    if (!hasGenreFilter && !hasFavFilter) return yearGroups

    return yearGroups
      .map((group) => ({
        ...group,
        games: group.games.filter((game) => {
          if (hasFavFilter && !favoriteIds.includes(game.id)) return false
          if (hasGenreFilter && !game.genres.some((g) => genreIds.includes(g.id))) return false
          return true
        }),
      }))
      .filter((group) => group.games.length > 0)
  }, [yearGroups, showFavorites, favoriteIds, genreIds])

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
        {filteredYearGroups && filteredYearGroups.length > 0 ? (
          filteredYearGroups.map((group) => (
            <YearSection key={group.year} year={group.year} games={group.games} />
          ))
        ) : (
          <EmptyState heading={showFavorites ? "No Favorites Yet" : "No Games Match Filters"} />
        )}
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
