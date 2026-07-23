import { useState } from "react"
import { ScrollView, ViewStyle } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { YearSection } from "@/components/YearSection"
import { $styles } from "@/theme/styles"
import { useFilteredGamesByYear } from "@/stores/gameFeed"
import { useSettings } from "@/stores/settings"
import { FeedSearch } from "@/components/FeedSearch"
import { ViewOptionsSheet } from "@/components/ViewOptionsSheet"
import { FilterMenu } from "@/components/FilterMenu"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function GameFeedScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const { yearGroups, isLoading, isError } = useFilteredGamesByYear(searchQuery)
  const { viewMode } = useSettings()

  const [viewOptionsOpen, setViewOptionsOpen] = useState(false)
  const { bottom } = useSafeAreaInsets()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isError || !yearGroups || yearGroups.length === 0) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState
          heading="There's Nothing Here..."
          content="Try adjusting your filters or search query."
          ButtonProps={{ text: "Clear Search" }}
          buttonOnPress={() => setSearchQuery("")}
        />
      </Screen>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: bottom }}
      style={$styles.flex1}
      contentInsetAdjustmentBehavior="automatic"
    >
      <FilterMenu handleOpenViewOptions={() => setViewOptionsOpen(true)} />

      <FeedSearch searchQuery={searchQuery} onChangeText={setSearchQuery} />

      <ScrollView>
        {yearGroups.map((group) => (
          <YearSection key={group.year} year={group.year} games={group.games} viewMode={viewMode} />
        ))}
      </ScrollView>

      <ViewOptionsSheet isOpen={viewOptionsOpen} onClose={() => setViewOptionsOpen(false)} />
    </ScrollView>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
