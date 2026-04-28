import { ActivityIndicator, FlatList, Image, ImageStyle, View, ViewStyle } from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { type FeedGenre, useFeedGenres } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function GenreListScreen() {
  const { themed, theme } = useAppTheme()
  const { data: genres = [], isLoading, isError } = useFeedGenres()
  const { isSelected, toggleGenre } = useGenreFilter()

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
          Select your favorite genres to personalize your feed.
        </Text>
      </View>

      <FlatList<FeedGenre>
        data={genres}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <GenreRow
            genre={item}
            selected={isSelected(item.id)}
            onToggle={() => toggleGenre(item.id)}
          />
        )}
        contentContainerStyle={themed($listContent)}
        ItemSeparatorComponent={() => <View style={themed($separator)} />}
      />
    </Screen>
  )
}

interface GenreRowProps {
  genre: FeedGenre
  selected: boolean
  onToggle: () => void
}

function GenreRow({ genre, selected, onToggle }: GenreRowProps) {
  const { themed } = useAppTheme()

  return (
    <Checkbox
      value={selected}
      onValueChange={onToggle}
      labelPosition="right"
      containerStyle={themed($row)}
      inputWrapperStyle={$styles.flex1}
      LabelTextProps={{
        children: (
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
          </View>
        ),
      }}
    />
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

const $dimText: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.textDim,
})
