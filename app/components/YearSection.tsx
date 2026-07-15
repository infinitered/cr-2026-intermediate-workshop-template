import { FlatList, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { GameCard } from "./GameCard"
import { YearBadge } from "./YearBadge"
import type { Game } from "../services/api/types"

interface YearSectionProps {
  year: string
  games: Game[]
}

export function YearSection({ year, games }: YearSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <YearBadge year={year} />
      <FlatList
        horizontal
        data={games}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <GameCard game={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={themed($listContent)}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  marginTop: spacing.sm,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
  gap: spacing.sm,
})
