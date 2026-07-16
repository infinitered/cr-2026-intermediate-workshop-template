import { useState } from "react"
import { ScrollView, ViewStyle } from "react-native"
import { Stack } from "expo-router"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { YearSection } from "@/components/YearSection"
import { $styles } from "@/theme/styles"
import { SORT_OPTIONS, useFilteredGamesByYear } from "@/stores/gameFeed"
import { useSettings, type SortOrder } from "@/stores/settings"
import { useGenreFilter } from "@/stores/genreFilter"
import { useFeedGenres } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"
import { useToolbarIcons } from "@/utils/useToolbarIcons"

export function GameFeedScreen() {
  const { yearGroups, isLoading, isError } = useFilteredGamesByYear()
  const { theme } = useAppTheme()
  const { viewMode, setViewMode, sortOrder, sortAscending, setSortOrder, setSortAscending } =
    useSettings()
  const { selectedIds: genreIds, isSelected, toggleGenre, clearGenres } = useGenreFilter()
  const { data: genres = [] } = useFeedGenres()
  const toolbarIcon = useToolbarIcons(theme.colors.brandSurfaceText)

  const [viewOptionsOpen, setViewOptionsOpen] = useState(false)

  const hasFilters = genreIds.length > 0

  const handleSort = (order: SortOrder) => {
    if (order === sortOrder) {
      setSortAscending(!sortAscending) // tapping the active row toggles direction
    } else {
      setSortOrder(order)
      setSortAscending(true)
    }
  }

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
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          icon={toolbarIcon("filter")}
          variant={hasFilters ? "prominent" : "plain"}
          tintColor={hasFilters ? theme.colors.tint : undefined}
        >
          <Stack.Toolbar.Menu inline>
            {SORT_OPTIONS.map((order) => (
              <Stack.Toolbar.MenuAction
                key={order}
                isOn={sortOrder === order}
                subtitle={
                  sortOrder === order ? (sortAscending ? "Ascending" : "Descending") : undefined
                }
                onPress={() => handleSort(order)}
              >
                {order}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>

          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction
              isOn={viewMode === "gallery"}
              onPress={() => setViewMode("gallery")}
            >
              Gallery
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              isOn={viewMode === "list"}
              onPress={() => setViewMode("list")}
            >
              List
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>

          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.Menu>
              <Stack.Toolbar.Label>Filter</Stack.Toolbar.Label>
              <Stack.Toolbar.Menu inline>
                <Stack.Toolbar.MenuAction isOn={genreIds.length === 0} onPress={clearGenres}>
                  All Items
                </Stack.Toolbar.MenuAction>
              </Stack.Toolbar.Menu>
              <Stack.Toolbar.Menu inline>
                {genres.map((genre) => (
                  <Stack.Toolbar.MenuAction
                    key={genre.id}
                    isOn={isSelected(genre.id)}
                    onPress={() => toggleGenre(genre.id)}
                  >
                    {genre.name}
                  </Stack.Toolbar.MenuAction>
                ))}
              </Stack.Toolbar.Menu>
            </Stack.Toolbar.Menu>
            {hasFilters && (
              <Stack.Toolbar.MenuAction onPress={clearGenres}>
                {genreIds.length === 1 ? "Remove Filter" : "Remove Filters"}
              </Stack.Toolbar.MenuAction>
            )}
          </Stack.Toolbar.Menu>

          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction onPress={() => setViewOptionsOpen(true)}>
              View Options
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <ScrollView>
        {yearGroups.map((group) => (
          <YearSection key={group.year} year={group.year} games={group.games} viewMode={viewMode} />
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
