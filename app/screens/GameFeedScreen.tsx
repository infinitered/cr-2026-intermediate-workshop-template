import { useLayoutEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, View, ViewStyle } from "react-native"
import { useNavigation } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Switch } from "@/components/Toggle/Switch"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByYear } from "@/services/api/games"
import { useFavorites } from "@/stores/favorites"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GameFeedScreen() {
  const { themed, theme } = useAppTheme()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { data: genres = [] } = useFeedGenres()
  const [showFavorites, setShowFavorites] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { ids: favoriteIds } = useFavorites()
  const { selectedIds: genreIds, isSelected, toggleGenre } = useGenreFilter()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setShowFilters((v) => !v)} hitSlop={8} style={{ marginRight: 16 }}>
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

      {showFilters && (
        <View style={themed($filterPanel)}>
          <Text weight="bold" size="xs" style={themed($filterLabel)}>
            Filter by Genre
          </Text>
          <View style={$genreGrid}>
            {genres.map((genre) => (
              <Checkbox
                key={genre.id}
                value={isSelected(genre.id)}
                onValueChange={() => toggleGenre(genre.id)}
                label={genre.name}
                containerStyle={$genreCheckbox}
              />
            ))}
          </View>
        </View>
      )}

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
