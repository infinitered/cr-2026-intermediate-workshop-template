import { useLayoutEffect, useMemo, useState } from "react"
import { Pressable, ScrollView, View, ViewStyle } from "react-native"
import { Stack, useNavigation } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByYear } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GameFeedScreen() {
  const { themed, theme } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { data: genres = [] } = useFeedGenres()
  const [showFilters, setShowFilters] = useState(false)
  const { selectedIds: genreIds, isSelected, toggleGenre } = useGenreFilter()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setShowFilters((v) => !v)} hitSlop={8} style={$filterButton}>
          <Ionicons
            name={showFilters ? "funnel" : "funnel-outline"}
            size={22}
            color={theme.colors.brandSurfaceText}
          />
        </Pressable>
      ),
    })
  }, [navigation, showFilters, theme.colors.brandSurfaceText])

  const filteredYearGroups = useMemo(() => {
    if (!yearGroups) return yearGroups
    const hasGenreFilter = genreIds.length > 0

    if (!hasGenreFilter) return yearGroups

    return yearGroups
      .map((group) => ({
        ...group,
        games: group.games.filter((game) => {
          if (hasGenreFilter && !game.genres.some((g) => genreIds.includes(g.id))) return false
          return true
        }),
      }))
      .filter((group) => group.games.length > 0)
  }, [yearGroups, genreIds])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isError || !yearGroups || yearGroups.length === 0) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState heading="There's Nothing Here..." />
      </Screen>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: bottom }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {filteredYearGroups && filteredYearGroups.length > 0 ? (
        filteredYearGroups.map((group) => (
          <YearSection key={group.year} year={group.year} games={group.games} />
        ))
      ) : (
        <EmptyState heading="No Games Match Filters" />
      )}
    </ScrollView>
  )
}

const $filterButton: ViewStyle = {
  marginRight: 16,
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $filterPanel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderBottomWidth: 2,
  borderBottomColor: colors.border,
  backgroundColor: colors.background,
})

const $filterLabel: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $genreGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 4,
}

const $genreCheckbox: ViewStyle = {
  width: "48%",
}
