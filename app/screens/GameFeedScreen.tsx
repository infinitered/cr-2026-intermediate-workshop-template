import { useMemo, useState } from "react"
import { Platform, ScrollView, ViewStyle } from "react-native"
import { Stack } from "expo-router"
import FilterList from "@expo/material-symbols/filter_list.xml"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { YearSection } from "@/components/YearSection"
import { useGamesByYear } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"

export function GameFeedScreen() {
  const { bottom } = useSafeAreaInsets()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const [showFilters, setShowFilters] = useState(false)
  const { selectedIds: genreIds } = useGenreFilter()

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
    <>
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
