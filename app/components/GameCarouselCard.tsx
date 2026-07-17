import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { router } from "expo-router"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { formatDate } from "@/utils/formatDate"

import type { Game } from "../services/api/types"

interface GameCarouselCardProps {
  game: Game
}

/**
 * A game card that fills its container so the native Jetpack Compose carousel can mask and
 * morph it during swipes. Used by the Android `GameGallery`; the cover image fills the slot
 * with the title overlaid along the bottom edge.
 */
export function GameCarouselCard({ game }: GameCarouselCardProps) {
  const { themed } = useAppTheme()

  return (
    <Pressable style={$fill} onPress={() => router.push(`/game/${game.id}`)}>
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={$image} resizeMode="cover" />
      ) : (
        <View style={themed([$image, $imagePlaceholder])} />
      )}
      <View style={themed($overlay)}>
        <Text weight="bold" size="xs" numberOfLines={1} style={$overlayText}>
          {game.name}
        </Text>
        <Text size="xxs" style={$overlayText}>
          {game.released ? formatDate(game.released) : "TBA"}
        </Text>
      </View>
    </Pressable>
  )
}

const $fill: ViewStyle = {
  flex: 1,
}

const $image: ImageStyle = {
  flex: 1,
  width: "100%",
}

const $imagePlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.purpleMuted200,
})

const $overlay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: spacing.xs,
  backgroundColor: "rgba(0, 0, 0, 0.55)",
})

const $overlayText: TextStyle = {
  color: "#fff",
}
