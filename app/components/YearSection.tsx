import { TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { GameGallery } from "./GameGallery"
import { GameListItem } from "./GameListItem"
import type { Game } from "../services/api/types"

interface YearSectionProps {
  year: string
  games: Game[]
  viewMode: "gallery" | "list"
}

export function YearSection({ year, games, viewMode }: YearSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <View style={themed($badge)}>
        <Text weight="bold" size="xxs" style={themed($badgeText)}>
          {year}
        </Text>
      </View>
      {viewMode === "list" ? (
        games.map((game) => <GameListItem key={game.id} game={game} />)
      ) : (
        <GameGallery games={games} />
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  marginTop: spacing.sm,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.brandAccent,
  borderRadius: spacing.md,
  borderWidth: 2,
  borderColor: "#000",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  marginBottom: spacing.sm,
  marginLeft: spacing.lg,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccentText,
})
