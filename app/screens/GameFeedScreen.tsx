import { useMemo, useState } from "react"
import { Platform, ScrollView, View, ViewStyle } from "react-native"
import { Stack } from "expo-router"
import FilterList from "@expo/material-symbols/filter_list.xml"
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
import type { ThemedStyle } from "@/theme/types"

export function GameFeedScreen() {
  const { themed } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { data: genres = [] } = useFeedGenres()
  const [showFilters, setShowFilters] = useState(false)
  const [searchText, setSearchText] = useState("")
  const { selectedIds: genreIds, isSelected, toggleGenre } = useGenreFilter()

  const filteredYearGroups = useMemo(() => {
    if (!yearGroups) return yearGroups
    const hasGenreFilter = genreIds.length > 0
    const query = searchText.toLowerCase().trim()

    if (!hasGenreFilter && !query) return yearGroups

    return yearGroups
      .map((group) => ({
        ...group,
        games: group.games.filter((game) => {
          if (hasGenreFilter && !game.genres.some((g) => genreIds.includes(g.id))) return false
          if (query && !game.name.toLowerCase().includes(query)) return false
          return true
        }),
      }))
      .filter((group) => group.games.length > 0)
  }, [yearGroups, genreIds, searchText])

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
    <>
      <Stack.SearchBar
        placeholder="Search games..."
        onChangeText={(e) => setSearchText(e.nativeEvent.text)}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={
            Platform.OS === "ios"
              ? showFilters
                ? "line.3.horizontal.decrease.circle.fill"
                : "line.3.horizontal.decrease.circle"
              : FilterList
          }
          onPress={() => setShowFilters((v) => !v)}
        />
      </Stack.Toolbar>
      {showFilters && (
        <View
          style={[
            themed($filterPanel),
            isAndroid && {
              borderBottomColor: materialColors.outline,
              backgroundColor: materialColors.surfaceContainerLow,
            },
          ]}
        >
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
    </>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const isAndroid = Platform.OS === "android"

const $filterPanel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderBottomWidth: isAndroid ? 1 : 2,
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
