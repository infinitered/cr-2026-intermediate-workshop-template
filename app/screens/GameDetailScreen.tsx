import { ActivityIndicator, FlatList, Image, ImageStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { useGameDetail, useGameScreenshots } from "@/services/api/games"
import { useFavorites } from "@/stores/favorites"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { formatDate } from "@/utils/formatDate"

interface GameDetailScreenProps {
  id: number
}

export function GameDetailScreen({ id }: GameDetailScreenProps) {
  const { themed, theme } = useAppTheme()
  const { data: game, isLoading, isError } = useGameDetail(id)
  const { data: screenshots } = useGameScreenshots(id)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  if (isError || !game) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState heading="There's Nothing Here..." />
      </Screen>
    )
  }

  const screenshotImages = screenshots?.results ?? []
  const coverImage = screenshotImages[0]?.image ?? game.background_image
  const thumbScreenshots = screenshotImages.slice(0, 6)
  const genres = game.genres?.map((g) => g.name).join(", ")
  const studio = game.developers?.map((d) => d.name).join(", ")
  const reviewCount = Number(game.reviews_text_count) || 0

  return (
    <Screen preset="scroll">
      {/* Hero image with favorites overlay at top-right */}
      <View>
        {game.background_image && (
          <Image source={{ uri: game.background_image }} style={$heroImage} blurRadius={3} />
        )}
        <View style={themed($favoriteOverlay)}>
          <Text weight="bold" size="xs" text="Add to Favorites" style={$favoriteText} />
          <Switch value={isFavorite(id)} onValueChange={() => toggleFavorite(id)} />
        </View>
      </View>

      {/* Cover thumbnail (overlaps hero) + Title */}
      <View style={themed($titleRow)}>
        {coverImage && <Image source={{ uri: coverImage }} style={themed($coverThumbnail)} />}
        <View style={[$styles.flex1, $titleTextWrap]}>
          <Text preset="heading" size="xl">
            {game.name}
          </Text>
        </View>
      </View>

      {/* Screenshot thumbnails */}
      {thumbScreenshots.length > 0 && (
        <FlatList
          horizontal
          data={thumbScreenshots}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={themed($screenshot)} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={themed($screenshotList)}
        />
      )}

      {/* Game metadata */}
      <View style={themed($infoSection)}>
        {game.released && (
          <View style={$styles.row}>
            <Text weight="bold" size="xs" text="Released:  " />
            <Text size="xs">{formatDate(game.released)}</Text>
          </View>
        )}

        {genres ? (
          <View style={$styles.row}>
            <Text weight="bold" size="xs" text="Genre:  " />
            <Text size="xs">{genres}</Text>
          </View>
        ) : null}

        {studio ? (
          <View style={[$styles.row, $shrink]}>
            <Text weight="bold" size="xs" text="Studio:  " />
            <Text size="xs" style={$styles.flex1}>
              {studio}
            </Text>
          </View>
        ) : null}

        <View style={$styles.row}>
          <Text weight="bold" size="xs">
            Rating ({game.ratings_count} ratings):
          </Text>
        </View>
      </View>

      {/* Description */}
      {game.description_raw || game.description ? (
        <View style={themed($descriptionSection)}>
          <Text size="xs">{game.description_raw || game.description.replace(/<[^>]*>/g, "")}</Text>
        </View>
      ) : null}

      {/* Reviews section */}
      <View style={themed($reviewsHeader)}>
        <Text weight="bold" size="sm">
          Reviews: {reviewCount}
        </Text>
      </View>

      <View style={themed($writeReviewSection)}>
        <Button text="Write A Review" style={themed($reviewButton)} />
      </View>

      {reviewCount === 0 && (
        <View style={themed($emptyReviews)}>
          <EmptyState heading="There's Nothing Here..." />
        </View>
      )}
    </Screen>
  )
}

const $shrink: ViewStyle = { flexShrink: 1 }

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $heroImage: ImageStyle = {
  width: "100%",
  height: 180,
}

const $favoriteOverlay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: spacing.xs,
  right: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
})

const $favoriteText: ViewStyle & { color: string } = {
  color: "#fff",
}

const $titleRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-end",
  gap: spacing.md,
  paddingHorizontal: spacing.lg,
  marginTop: -50,
  marginBottom: spacing.sm,
})

const $titleTextWrap: ViewStyle = {
  paddingTop: 54,
}

const $coverThumbnail: ThemedStyle<ImageStyle> = ({ spacing, colors }) => ({
  width: 90,
  height: 120,
  borderRadius: spacing.xs,
  borderWidth: 2,
  borderColor: colors.palette.purpleMuted800,
})

const $screenshotList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  gap: spacing.xs,
})

const $screenshot: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 60,
  height: 60,
  borderRadius: spacing.xxs,
})

const $infoSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  gap: spacing.xxs,
  paddingVertical: spacing.sm,
})

const $descriptionSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})

const $reviewsHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})

const $writeReviewSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
})

const $reviewButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandSurface,
  borderRadius: spacing.xs,
})

const $emptyReviews: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  alignItems: "center",
})
