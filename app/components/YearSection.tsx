import { View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { GameGallery } from "./GameGallery"
import { GameListItem } from "./GameListItem"
import { YearBadge } from "./YearBadge"
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
      <YearBadge year={year} />
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
