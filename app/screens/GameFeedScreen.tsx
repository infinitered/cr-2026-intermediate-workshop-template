import { useMemo, useState } from "react"
import { ActivityIndicator, ScrollView, ViewStyle } from "react-native"
import { Stack } from "expo-router"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByYear } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"

type SortField = "name" | "rating" | "releaseDate"
type ViewMode = "gallery" | "list"

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "rating", label: "Rating" },
  { field: "releaseDate", label: "Release Date" },
]

export function GameFeedScreen() {
  const { theme } = useAppTheme()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { data: genres = [] } = useFeedGenres()
  const { selectedIds: genreIds, isSelected, toggleGenre, clearGenres } = useGenreFilter()

  const [sortField, setSortField] = useState<SortField>("name")
  const [sortAscending, setSortAscending] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")

  const hasFilters = genreIds.length > 0

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortAscending((prev) => !prev)
    } else {
      setSortField(field)
      setSortAscending(true)
    }
  }

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
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          variant={hasFilters ? "prominent" : "plain"}
          tintColor={hasFilters ? theme.colors.tint : undefined}
        >
          <Stack.Toolbar.Icon sf="line.3.horizontal.decrease" />

          <Stack.Toolbar.Menu inline>
            {SORT_OPTIONS.map(({ field, label }) => (
              <Stack.Toolbar.MenuAction
                key={field}
                isOn={sortField === field}
                subtitle={
                  sortField === field ? (sortAscending ? "Ascending" : "Descending") : undefined
                }
                onPress={() => handleSort(field)}
              >
                {label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>

          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction
              icon="square.grid.2x2"
              isOn={viewMode === "gallery"}
              onPress={() => setViewMode("gallery")}
            >
              Gallery
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="list.bullet"
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
                <Stack.Toolbar.MenuAction
                  icon="rectangle.grid.3x3"
                  isOn={genreIds.length === 0}
                  onPress={clearGenres}
                >
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
              <Stack.Toolbar.MenuAction icon="minus.circle" onPress={clearGenres}>
                {genreIds.length === 1 ? "Remove Filter" : "Remove Filters"}
              </Stack.Toolbar.MenuAction>
            )}
          </Stack.Toolbar.Menu>

          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction onPress={() => console.log("View Options pressed")}>
              View Options
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

      <ScrollView>
        {filteredYearGroups && filteredYearGroups.length > 0 ? (
          filteredYearGroups.map((group) => (
            <YearSection key={group.year} year={group.year} games={group.games} />
          ))
        ) : (
          <EmptyState heading="No Games Match Filters" />
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
