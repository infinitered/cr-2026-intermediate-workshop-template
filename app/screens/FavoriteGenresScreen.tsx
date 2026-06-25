import { Image, ImageStyle, SectionList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { FeedGenre } from "@/services/api/games"
import { useFavoriteGenresService } from "@/services/favoriteGenresService"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function FavoriteGenresScreen() {
  const { themed } = useAppTheme()
  const { favoriteGenres, otherGenres, isLoading, isFavorite, toggleFavorite } =
    useFavoriteGenresService()

  if (isLoading) {
    return <LoadingScreen />
  }

  const sections = [
    { title: "Favorite Genres", data: favoriteGenres, isFavoriteSection: true },
    { title: "All Genres", data: otherGenres, isFavoriteSection: false },
  ]

  return (
    <Screen preset="fixed">
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => (
          <View style={themed($sectionHeader)}>
            <Text weight="bold" size="sm">
              {section.title}
            </Text>
            {section.isFavoriteSection && section.data.length === 0 && (
              <Text size="xxs" style={themed($emptyHint)}>
                Add genres below to personalize recommendations
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <GenreRow genre={item} isFavorite={isFavorite(item.id)} onToggle={toggleFavorite} />
        )}
        ItemSeparatorComponent={() => <View style={themed($separator)} />}
        contentContainerStyle={themed($listContent)}
        stickySectionHeadersEnabled={false}
      />
    </Screen>
  )
}

interface GenreRowProps {
  genre: FeedGenre
  isFavorite: boolean
  onToggle: (id: number) => void
}

function GenreRow({ genre, isFavorite, onToggle }: GenreRowProps) {
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($row)}>
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
            {genre.gameCount} {genre.gameCount === 1 ? "game" : "games"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onToggle(genre.id)} hitSlop={8}>
          <Ionicons
            name={isFavorite ? "remove-circle" : "add-circle"}
            size={28}
            color={isFavorite ? theme.colors.error : theme.colors.brandAccent}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingTop: spacing.lg,
  paddingBottom: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  backgroundColor: colors.background,
})

const $emptyHint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
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
