import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { router } from "expo-router"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { type FeedGenre, useFeedGenres } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GenreListScreen() {
  const { themed, theme } = useAppTheme()
  const { data: genres = [], isLoading, isError } = useFeedGenres()
  const { isSelected } = useGenreFilter()

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  if (isError || (!isLoading && genres.length === 0)) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState heading="There's Nothing Here..." />
      </Screen>
    )
  }

  return (
    <Screen preset="fixed">
      <View style={themed($header)}>
        <Text size="xs" style={themed($headerText)}>
          Tap a genre to browse games and add it to your feed filter.
        </Text>
      </View>

      <FlatList<FeedGenre>
        data={genres}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <GenreRow genre={item} inFeed={isSelected(item.id)} />}
        contentContainerStyle={themed($listContent)}
        ItemSeparatorComponent={() => <View style={themed($separator)} />}
      />
    </Screen>
  )
}

interface GenreRowProps {
  genre: FeedGenre
  inFeed: boolean
}

function GenreRow({ genre, inFeed }: GenreRowProps) {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={themed($row)}
      onPress={() => router.push(`/genre/${genre.id}`)}
    >
      <View style={[$styles.row, $styles.flex1, $rowContent]}>
        {genre.image_background ? (
          <Image source={{ uri: genre.image_background }} style={themed($thumbnail)} />
        ) : (
          <View style={[themed($thumbnail), themed($thumbnailPlaceholder)]} />
        )}
        <View style={$textColumn}>
          <Text weight="bold" size="sm">
            {genre.name}
          </Text>
          <Text size="xxs" style={themed($dimText)}>
            {genre.gameCount} {genre.gameCount === 1 ? "game" : "games"} in feed
          </Text>
        </View>
        {inFeed && (
          <View style={themed($feedBadge)}>
            <Text weight="bold" size="xxs" style={themed($feedBadgeText)}>
              In Feed
            </Text>
          </View>
        )}
        <Text size="lg" style={themed($chevron)}>
          {">"}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
})

const $headerText: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
})

const $rowContent: ViewStyle = {
  alignItems: "center",
  gap: 12,
}

const $textColumn: ViewStyle = {
  flex: 1,
}

const $thumbnail: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 48,
  height: 48,
  borderRadius: spacing.xs,
})

const $thumbnailPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.border,
})

const $dimText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $feedBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandAccent,
  borderRadius: spacing.xs,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
})

const $feedBadgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccentText,
})

const $chevron: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
