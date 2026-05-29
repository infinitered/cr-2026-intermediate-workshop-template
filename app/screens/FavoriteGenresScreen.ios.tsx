import { ActivityIndicator, ViewStyle } from "react-native"
import { Image as ExpoImage } from "expo-image"
import { Host, List, Section, Label, Image, RNHostView } from "@expo/ui/swift-ui"
import { tag, onTapGesture, contentShape, shapes } from "@expo/ui/swift-ui/modifiers"

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

  const genreIcon = (genre: FeedGenre) =>
    genre.image_background ? (
      <RNHostView matchContents>
        <ExpoImage source={genre.image_background} style={$thumbnail} />
      </RNHostView>
    ) : (
      <Image systemName="gamecontroller.fill" size={20} color={theme.colors.tint} />
    )

  return (
    <Host style={$host}>
      <List>
        <Section title="Favorite Genres">
          {favoriteGenres.length === 0 ? (
            <Label
              title="Add genres below to personalize recommendations"
              systemImage="info.circle"
            />
          ) : (
            favoriteGenres.map((genre) => (
              <Label
                key={genre.id}
                title={genre.name}
                subtitle={`${genre.gameCount} ${genre.gameCount === 1 ? "game" : "games"}`}
                icon={genreIcon(genre)}
                modifiers={[
                  tag(genre.id),
                  contentShape(shapes.rectangle()),
                  onTapGesture(() => removeFavoriteGenre(genre.id)),
                ]}
              />
            ))
          )}
        </Section>
        <Section title="All Genres">
          {otherGenres.map((genre) => (
            <Label
              key={genre.id}
              title={genre.name}
              subtitle={`${genre.gameCount} ${genre.gameCount === 1 ? "game" : "games"}`}
              icon={genreIcon(genre)}
              modifiers={[
                tag(genre.id),
                contentShape(shapes.rectangle()),
                onTapGesture(() => addFavoriteGenre(genre.id)),
              ]}
            />
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

const $thumbnail = {
  width: 40,
  height: 40,
  borderRadius: 6,
}
