import { Stack } from "expo-router"

import { SORT_OPTIONS } from "@/stores/gameFeed"
import { useSettings, type SortOrder } from "@/stores/settings"
import { useGenreFilter } from "@/stores/genreFilter"
import { useFeedGenres } from "@/services/api/games"
import { useToolbarIcons } from "@/utils/useToolbarIcons"
import { colors } from "@/theme/colors"

interface FilterMenuProps {
  handleOpenViewOptions: () => void
}

export function FilterMenu({ handleOpenViewOptions }: FilterMenuProps) {
  const toolbarIcon = useToolbarIcons(colors.brandSurfaceText)
  const { selectedIds: genreIds, isSelected, toggleGenre, clearGenres } = useGenreFilter()
  const hasFilters = genreIds.length > 0
  const { sortOrder, sortAscending, setSortOrder, setSortAscending, viewMode, setViewMode } =
    useSettings()
  const { data: genres = [] } = useFeedGenres()

  const handleSort = (order: SortOrder) => {
    if (order === sortOrder) {
      setSortAscending(!sortAscending) // tapping the active row toggles direction
    } else {
      setSortOrder(order)
      setSortAscending(true)
    }
  }

  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={toolbarIcon("filter")}
        variant={hasFilters ? "prominent" : "plain"}
        tintColor={hasFilters ? colors.tint : undefined}
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
          <Stack.Toolbar.MenuAction isOn={viewMode === "list"} onPress={() => setViewMode("list")}>
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
          <Stack.Toolbar.MenuAction onPress={handleOpenViewOptions}>
            View Options
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  )
}
