import { Image, ImageStyle, Platform, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Link } from "expo-router"
import { useMaterialColors } from "@expo/ui/jetpack-compose"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { formatDate } from "@/utils/formatDate"

import type { Game } from "../services/api/types"

const isAndroid = Platform.OS === "android"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const { themed } = useAppTheme()
  const materialColors = useMaterialColors()

  return (
    <Link href={`/game/${game.id}`} asChild>
      <Pressable style={themed($cardOuter)}>
        <View
          style={[
            themed($cardInner),
            isAndroid && {
              backgroundColor: materialColors.surfaceContainer,
              borderColor: materialColors.outline,
            },
          ]}
        >
          <Link.AppleZoom>
            {game.background_image ? (
              <Image source={{ uri: game.background_image }} style={themed($image)} />
            ) : (
              <View
                style={[
                  themed([$image, $imagePlaceholder]),
                  isAndroid && { backgroundColor: materialColors.surfaceContainerHigh },
                ]}
              />
            )}
          </Link.AppleZoom>
          <View style={themed($textContainer)}>
            <Text
              weight="bold"
              size="xxs"
              numberOfLines={1}
              style={[themed($cardText), isAndroid && { color: materialColors.onSurface }]}
            >
              {game.name}
            </Text>
            <Text
              size="xxs"
              style={[themed($cardText), isAndroid && { color: materialColors.onSurface }]}
            >
              {game.released ? formatDate(game.released) : "TBA"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const CARD_WIDTH = 150

const $cardOuter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: CARD_WIDTH,
  borderRadius: spacing.sm,
  ...(isAndroid
    ? { elevation: 2 }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }),
})

const $cardInner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandSurface,
  borderColor: "#000",
  borderWidth: isAndroid ? 1 : 2,
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
  color: colors.brandSurfaceText,
})
