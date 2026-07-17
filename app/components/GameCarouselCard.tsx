import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Color, router } from "expo-router"

import { Text } from "@/components/Text"
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
  return (
    <Pressable style={$fill} onPress={() => router.push(`/game/${game.id}`)}>
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={$image} resizeMode="cover" />
      ) : (
        <View style={[$image, $imagePlaceholder]} />
      )}
      <View style={$overlay}>
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

const $imagePlaceholder: ViewStyle = {
  backgroundColor: Color.android.dynamic.surfaceContainerHigh,
}

const $overlay: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: 6,
  backgroundColor: Color.android.dynamic.surfaceContainer,
}

const $overlayText: TextStyle = {
  color: Color.android.dynamic.onSurface,
}
