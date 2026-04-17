import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { router } from "expo-router"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { formatDate } from "@/utils/formatDate"

import type { Game } from "../services/api/types"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={themed($cardOuter)}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      <View style={themed($cardInner)}>
        {game.background_image ? (
          <Image source={{ uri: game.background_image }} style={themed($image)} />
        ) : (
          <View style={themed([$image, $imagePlaceholder])} />
        )}
        <View style={themed($textContainer)}>
          <Text weight="bold" size="xxs" numberOfLines={1} style={themed($cardText)}>
            {game.name}
          </Text>
          <Text size="xxs" style={themed($cardText)}>
            {game.released ? formatDate(game.released) : "TBA"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const CARD_WIDTH = 150

const $cardOuter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: CARD_WIDTH,
  borderRadius: spacing.sm,
  shadowColor: "#000",
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
})

const $cardInner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.lemon500,
  borderColor: "#000",
  borderWidth: 2,
  borderRadius: spacing.sm,
  overflow: "hidden",
})

const $image: ThemedStyle<ImageStyle> = () => ({
  width: CARD_WIDTH,
  height: 213,
})

const $imagePlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.purpleMuted200,
})

const $textContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xxs,
})

const $cardText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.purpleMuted900,
})
