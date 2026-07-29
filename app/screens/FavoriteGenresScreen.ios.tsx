import { LoadingScreen } from "@/components/LoadingScreen"

import type { FeedGenre } from "@/services/api/games"
import { useFavoriteGenresService } from "@/services/favoriteGenresService"

import { Host, List, Section, Label, Image, LabeledContent } from "@expo/ui/swift-ui"
import { environment, tag, onTapGesture, moveDisabled } from "@expo/ui/swift-ui/modifiers"

export function FavoriteGenresScreen() {
  const { favoriteGenres, otherGenres, isLoading, isFavorite, toggleFavorite } =
    useFavoriteGenresService()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[environment("editMode", "active")]}>
        <Section title="Your Favorites">
          {favoriteGenres.length === 0 ? (
            <Label
              title="Add genres below to personalize recommendations"
              systemImage="info.circle"
            />
          ) : (
            <List.ForEach
              onDelete={(indices) => {
                indices.forEach((index) => toggleFavorite(favoriteGenres[index].id))
              }}
            >
              {favoriteGenres.map((genre) => (
                <Label
                  key={genre.id}
                  title={genre.name}
                  modifiers={[tag(genre.id), moveDisabled(true)]}
                />
              ))}
            </List.ForEach>
          )}
        </Section>
        <Section title="Available Genres">
          {otherGenres.map((genre) => (
            <LabeledContent
              key={genre.id}
              label={genre.name}
              modifiers={[tag(genre.id), onTapGesture(() => toggleFavorite(genre.id))]}
            >
              <Image systemName="plus.circle" size={22} />
            </LabeledContent>
          ))}
        </Section>
      </List>
    </Host>
  )
}
