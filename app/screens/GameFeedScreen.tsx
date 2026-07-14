import { type ComponentRef, useMemo, useRef, useState } from "react"
import { Platform, Pressable, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native"
import { Stack } from "expo-router"
import { SymbolView } from "expo-symbols"
import { BottomSheet, FieldGroup, Picker, Switch } from "@expo/ui"

import { EmptyState } from "@/components/EmptyState"
import { FeedSearch } from "@/components/FeedSearch"
import { Screen } from "@/components/Screen"
import { TextField } from "@/components/TextField"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useGenreFilter } from "@/stores/genreFilter"
import { useSettings, type SortOrder } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { useToolbarIcons, type ToolbarIconKey } from "@/utils/useToolbarIcons"
import { LoadingScreen } from "@/components/LoadingScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type ViewMode = "gallery" | "list"

const SORT_OPTIONS: SortOrder[] = ["Name", "Rating", "Release Date"]

const isMature = (game: Game) =>
  game.esrb_rating?.slug === "mature" || game.esrb_rating?.slug === "adults-only"

const compareGames = (a: Game, b: Game, order: SortOrder) => {
  switch (order) {
    case "Name":
      return a.name.localeCompare(b.name)
    case "Rating":
      return a.rating - b.rating
    case "Release Date":
      return (a.released ?? "").localeCompare(b.released ?? "")
  }
}

export function GameFeedScreen() {
  const { theme } = useAppTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { data: yearGroups, isLoading, isError } = useGamesByYear()
  const { data: genres = [] } = useFeedGenres()
  const { selectedIds: genreIds, isSelected, toggleGenre, clearGenres } = useGenreFilter()
  const { sortOrder, setSortOrder, hideMature, setHideMature } = useSettings()
  const toolbarIcon = useToolbarIcons(theme.colors.brandSurfaceText)
  // Menu-row icons are iOS-only: Android overflow menus are conventionally text-only, and the
  // selected state still shows via the `isOn` checkmark. The toolbar trigger + search keep their icons.
  const menuIcon = (key: ToolbarIconKey) => (Platform.OS === "ios" ? toolbarIcon(key) : undefined)
  const { bottom } = useSafeAreaInsets()

  const [sortAscending, setSortAscending] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewOptionsOpen, setViewOptionsOpen] = useState(false)
  const searchInputRef = useRef<ComponentRef<typeof TextField>>(null)

  const hasFilters = genreIds.length > 0

  const closeSearch = () => {
    setSearchActive(false)
    setSearchQuery("")
  }

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  const handleSort = (order: SortOrder) => {
    if (order === sortOrder) {
      setSortAscending((prev) => !prev)
    } else {
      setSortOrder(order)
      setSortAscending(true)
    }
  }

  const filteredYearGroups = useMemo(() => {
    if (!yearGroups) return yearGroups
    const hasGenreFilter = genreIds.length > 0
    const query = searchQuery.trim().toLowerCase()

    return yearGroups
      .map((group) => {
        let games = group.games
        if (query) {
          games = games.filter((game) => game.name.toLowerCase().includes(query))
        }
        if (hasGenreFilter) {
          games = games.filter((game) => game.genres.some((g) => genreIds.includes(g.id)))
        }
        if (hideMature) {
          games = games.filter((game) => !isMature(game))
        }
        games = [...games].sort((a, b) => {
          const result = compareGames(a, b, sortOrder)
          return sortAscending ? result : -result
        })
        return { ...group, games }
      })
      .filter((group) => group.games.length > 0)
  }, [yearGroups, genreIds, hideMature, sortOrder, sortAscending, searchQuery])

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
              icon={menuIcon("gallery")}
              isOn={viewMode === "gallery"}
              onPress={() => setViewMode("gallery")}
            >
              Gallery
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon={menuIcon("list")}
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
                  icon={menuIcon("allItems")}
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
              <Stack.Toolbar.MenuAction icon={menuIcon("removeFilter")} onPress={clearGenres}>
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

      {Platform.OS !== "android" && (
        <Stack.Toolbar placement="bottom">
          {searchActive ? (
            <>
              <Stack.Toolbar.View>
                <TextField
                  ref={searchInputRef}
                  autoFocus
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search games"
                  returnKeyType="search"
                  containerStyle={{ width: windowWidth - 96 }}
                  inputWrapperStyle={{ borderRadius: 999 }}
                  LeftAccessory={(props) => (
                    <View style={props.style}>
                      <SymbolView
                        name="magnifyingglass"
                        tintColor={theme.colors.textDim}
                        size={18}
                      />
                    </View>
                  )}
                  RightAccessory={
                    searchQuery.length > 0
                      ? (props) => (
                          <Pressable
                            onPress={clearSearch}
                            style={props.style}
                            hitSlop={8}
                            accessibilityLabel="Clear search"
                          >
                            <SymbolView
                              name="xmark.circle.fill"
                              tintColor={theme.colors.textDim}
                              size={18}
                            />
                          </Pressable>
                        )
                      : undefined
                  }
                />
              </Stack.Toolbar.View>
              <Stack.Toolbar.Spacer width={8} />
              <Stack.Toolbar.Button icon={toolbarIcon("close")} onPress={closeSearch} />
            </>
          ) : (
            <>
              <Stack.Toolbar.Spacer />
              <Stack.Toolbar.Button
                icon={toolbarIcon("search")}
                onPress={() => setSearchActive(true)}
              />
            </>
          )}
        </Stack.Toolbar>
      )}

      <FeedSearch onChangeText={setSearchQuery} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        {filteredYearGroups && filteredYearGroups.length > 0 ? (
          filteredYearGroups.map((group) => (
            <YearSection
              key={group.year}
              year={group.year}
              games={group.games}
              viewMode={viewMode}
            />
          ))
        ) : (
          <EmptyState heading="No Games Match Filters" />
        )}
      </ScrollView>

      <BottomSheet
        isPresented={viewOptionsOpen}
        onDismiss={() => setViewOptionsOpen(false)}
        snapPoints={["half", "full"]}
      >
        <FieldGroup>
          <FieldGroup.Section title="Sort By">
            <Picker
              selectedValue={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
              appearance="menu"
            >
              {SORT_OPTIONS.map((order) => (
                <Picker.Item key={order} label={order} value={order} />
              ))}
            </Picker>
          </FieldGroup.Section>
          <FieldGroup.Section title="Advanced">
            <Switch value={hideMature} onValueChange={setHideMature} label="Hide Mature Content" />
          </FieldGroup.Section>
        </FieldGroup>
      </BottomSheet>
    </>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
