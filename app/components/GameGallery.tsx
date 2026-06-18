import { FlatList, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { GameCard } from "./GameCard"
import type { Game } from "../services/api/types"

interface GameGalleryProps {
  games: Game[]
}

export function GameGallery({ games }: GameGalleryProps) {
  const { themed } = useAppTheme()

  return (
    <FlatList
      horizontal
      data={games}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <GameCard game={item} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={themed($listContent)}
    />
  )
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xs,
  gap: spacing.sm,
})
