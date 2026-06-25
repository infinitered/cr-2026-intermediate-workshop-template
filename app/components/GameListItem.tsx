import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { formatDate } from "@/utils/formatDate"

import type { Game } from "../services/api/types"

interface GameListItemProps {
  game: Game
}

export function GameListItem({ game }: GameListItemProps) {
  const { themed, theme } = useAppTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={themed($row)}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={themed($thumb)} />
      ) : (
        <View style={themed([$thumb, $thumbPlaceholder])} />
      )}

      <View style={$textCol}>
        <Text weight="bold" size="xs" numberOfLines={1} style={themed($text)}>
          {game.name}
        </Text>
        <Text size="xxs" numberOfLines={1} style={themed($text)}>
          {game.released ? formatDate(game.released) : "TBA"}
        </Text>
      </View>

      <View style={$ratingCol}>
        <Ionicons name="star" size={14} color={theme.colors.brandSurfaceText} />
        <Text weight="bold" size="xs" style={themed($text)}>
          {game.rating.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  padding: spacing.xs,
  marginHorizontal: spacing.lg,
  marginBottom: spacing.sm,
  backgroundColor: colors.brandSurface,
  borderWidth: 2,
  borderColor: "#000",
  borderRadius: spacing.sm,
})

const $thumb: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 56,
  height: 56,
  borderRadius: spacing.xs,
})

const $thumbPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.purpleMuted200,
})

const $textCol: ViewStyle = {
  flex: 1,
}

const $ratingCol: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
}

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandSurfaceText,
})
