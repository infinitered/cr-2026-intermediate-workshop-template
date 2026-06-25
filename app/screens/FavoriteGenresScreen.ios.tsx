import { ActivityIndicator, ViewStyle } from "react-native"
import { Host, List, Section, Label, Image, LabeledContent } from "@expo/ui/swift-ui"
import { environment, tag, contentShape, shapes, onTapGesture } from "@expo/ui/swift-ui/modifiers"

import { Screen } from "@/components/Screen"
import { type FeedGenre, useFeedGenres } from "@/services/api/games"
import { useFavoriteGenres } from "@/stores/favoriteGenres"
import { useAppTheme } from "@/theme/context"

export function FavoriteGenresScreen() {
  const { theme } = useAppTheme()
  const { data: allGenres = [], isLoading } = useFeedGenres()
  const { ids: favoriteIds, addFavoriteGenre, removeFavoriteGenre } = useFavoriteGenres()

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  const favoriteGenres = favoriteIds
    .map((id) => allGenres.find((g) => g.id === id))
    .filter(Boolean) as FeedGenre[]

  const otherGenres = allGenres.filter((g) => !favoriteIds.includes(g.id))

  const handleDelete = (indices: number[]) => {
    for (const index of indices) {
      const genre = favoriteGenres[index]
      if (genre) removeFavoriteGenre(genre.id)
    }
  }

  const handleMove = (sourceIndices: number[], destination: number) => {
    // TODO: implement reorder in store if needed
  }

  return (
    <Host style={$host}>
      <List modifiers={[environment("editMode", "active")]}>
        <Section title="Your Favorites">
          {favoriteGenres.length === 0 ? (
            <Label
              title="Add genres below to personalize recommendations"
              systemImage="info.circle"
            />
          ) : (
            <List.ForEach onDelete={handleDelete} onMove={handleMove}>
              {favoriteGenres.map((genre) => (
                <Label key={genre.id} title={genre.name} modifiers={[tag(genre.id)]} />
              ))}
            </List.ForEach>
          )}
        </Section>
        <Section title="Available Genres">
          {otherGenres.map((genre) => (
            <LabeledContent
              key={genre.id}
              label={genre.name}
              modifiers={[tag(genre.id), onTapGesture(() => addFavoriteGenre(genre.id))]}
            >
              <Image systemName="plus.circle" size={22} color={theme.colors.textDim} />
            </LabeledContent>
          ))}
        </Section>
      </List>
    </Host>
  )
}

const $host: ViewStyle = {
  flex: 1,
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
