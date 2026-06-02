import { type ComponentRef, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native"
import { Stack } from "expo-router"
import { SymbolView } from "expo-symbols"
import {
  BottomSheet,
  Form,
  Group,
  Host,
  Picker,
  Section,
  Text as UIText,
  Toggle,
} from "@expo/ui/swift-ui"
import { pickerStyle, presentationDetents, tag } from "@expo/ui/swift-ui/modifiers"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { TextField } from "@/components/TextField"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useGenreFilter } from "@/stores/genreFilter"
import { useSettings, type SortOrder } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"

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
            <Stack.Toolbar.MenuAction onPress={() => setViewOptionsOpen(true)}>
              View Options
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

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
                    <SymbolView name="magnifyingglass" tintColor={theme.colors.textDim} size={18} />
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
            <Stack.Toolbar.Button icon="xmark" onPress={closeSearch} />
          </>
        ) : (
          <>
            <Stack.Toolbar.Spacer />
            <Stack.Toolbar.Button icon="magnifyingglass" onPress={() => setSearchActive(true)} />
          </>
        )}
      </Stack.Toolbar>

      <ScrollView style={$styles.flex1}>
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

      <Host style={$sheetHost}>
        <BottomSheet isPresented={viewOptionsOpen} onIsPresentedChange={setViewOptionsOpen}>
          <Group modifiers={[presentationDetents(["medium", "large"])]}>
            <Form>
              <Section header={<UIText>View Options</UIText>}>
                <Picker
                  label="Sort By"
                  modifiers={[pickerStyle("menu")]}
                  selection={sortOrder}
                  onSelectionChange={(value) => setSortOrder(value as SortOrder)}
                >
                  {SORT_OPTIONS.map((order) => (
                    <UIText key={order} modifiers={[tag(order)]}>
                      {order}
                    </UIText>
                  ))}
                </Picker>
              </Section>
              <Section title="Advanced">
                <Toggle
                  label="Hide Mature Content"
                  isOn={hideMature}
                  onIsOnChange={setHideMature}
                />
              </Section>
            </Form>
          </Group>
        </BottomSheet>
      </Host>
    </Screen>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $sheetHost: ViewStyle = {
  position: "absolute",
}
