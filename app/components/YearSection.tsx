import { FlatList, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { GameCard } from "./GameCard"
import type { Game } from "../services/api/types"

interface YearSectionProps {
  year: string
  games: Game[]
}

export function YearSection({ year, games }: YearSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <View style={themed($badge)}>
        <Text weight="bold" size="xxs" style={themed($badgeText)}>
          {year}
        </Text>
      </View>
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

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.palette.purple800,
  borderRadius: spacing.md,
  borderWidth: 2,
  borderColor: "#000",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  marginBottom: spacing.sm,
  marginLeft: spacing.lg,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.lemon500,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
  gap: spacing.sm,
})
