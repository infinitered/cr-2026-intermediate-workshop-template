import { useState } from "react"
import { ScrollView, ViewStyle } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { YearSection } from "@/components/YearSection"
import { useFilteredGamesByYear } from "@/stores/gameFeed"
import { $styles } from "@/theme/styles"
import { useSettings } from "@/stores/settings"

export function GameFeedScreen() {
  const { yearGroups, isLoading, isError } = useFilteredGamesByYear()
  const { viewMode } = useSettings()

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
