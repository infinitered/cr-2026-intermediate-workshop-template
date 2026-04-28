import {
  ActivityIndicator,
  Image,
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { YearSection } from "@/components/YearSection"
import { useFeedGenres, useGamesByGenre } from "@/services/api/games"
import { useGenreFilter } from "@/stores/genreFilter"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

interface GenreDetailScreenProps {
  id: number
}

export function GenreDetailScreen({ id }: GenreDetailScreenProps) {
  const { themed, theme } = useAppTheme()
  const { data: yearGroups, isLoading } = useGamesByGenre(id)
  const { data: genres } = useFeedGenres()
  const { isSelected, toggleGenre } = useGenreFilter()

  const genre = genres?.find((g) => g.id === id)

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  if (!genre) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState heading="Genre Not Found" />
      </Screen>
    )
  }

  const totalGames = yearGroups?.reduce((sum, g) => sum + g.games.length, 0) ?? 0

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      {genre.image_background && (
        <Image source={{ uri: genre.image_background }} style={$heroImage} blurRadius={2} />
      )}

      <View style={themed($infoRow)}>
        <View style={$styles.flex1}>
          <Text size="xs" style={themed($dimText)}>
            {totalGames} {totalGames === 1 ? "game" : "games"} in feed
          </Text>
        </View>
        <View style={$toggleRow}>
          <Text size="xs" style={themed($dimText)}>
            Show in Feed
          </Text>
          <Switch value={isSelected(id)} onValueChange={() => toggleGenre(id)} />
        </View>
      </View>

      <ScrollView>
        {yearGroups && yearGroups.length > 0 ? (
          yearGroups.map((group) => (
            <YearSection key={group.year} year={group.year} games={group.games} />
          ))
        ) : (
          <EmptyState heading="No Games Found" />
        )}
      </ScrollView>
    </Screen>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $heroImage: ImageStyle = {
  width: "100%",
  height: 160,
}

const $infoRow: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  gap: spacing.sm,
  borderBottomWidth: 2,
  borderBottomColor: colors.border,
  backgroundColor: colors.background,
})

const $toggleRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $dimText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
