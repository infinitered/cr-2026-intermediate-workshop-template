import { ActivityIndicator } from "react-native"
import {
  Host,
  LazyColumn,
  ListItem,
  HorizontalDivider,
  Text as ComposeText,
  Icon,
  IconButton,
} from "@expo/ui/jetpack-compose"
import { clickable, padding } from "@expo/ui/jetpack-compose/modifiers"

import { useFeedGenres, type FeedGenre } from "@/services/api/games"
import { useFavoriteGenres } from "@/stores/favoriteGenres"
import { Screen } from "@/components/Screen"
import { colors } from "@/theme/colors"
import AddCircle from "@expo/material-symbols/add_circle.xml"
import Remove from "@expo/material-symbols/remove.xml"

export function FavoriteGenresScreen() {
  const { data: allGenres = [], isLoading } = useFeedGenres()
  const { ids: favoriteIds, addFavoriteGenre, removeFavoriteGenre } = useFavoriteGenres()

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={{ flex: 1 }}>
        <ActivityIndicator size="large" color={colors.tint} />
      </Screen>
    )
  }

  const favoriteGenres = favoriteIds
    .map((id) => allGenres.find((g) => g.id === id))
    .filter(Boolean) as FeedGenre[]

  const otherGenres = allGenres.filter((g) => !favoriteIds.includes(g.id))

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn contentPadding={{ start: 16, end: 16, bottom: 24 }}>
        <ComposeText style={{ typography: "titleMedium" }} modifiers={[padding(0, 16, 0, 8)]}>
          Your Favorites
        </ComposeText>

        {favoriteGenres.map((genre) => (
          <ListItem key={genre.id} colors={{ containerColor: "transparent" }}>
            <ListItem.HeadlineContent>
              <ComposeText>{genre.name}</ComposeText>
            </ListItem.HeadlineContent>
            <ListItem.SupportingContent>
              <ComposeText>
                {genre.gameCount} {genre.gameCount === 1 ? "game" : "games"}
              </ComposeText>
            </ListItem.SupportingContent>
            <ListItem.TrailingContent>
              <IconButton onClick={() => removeFavoriteGenre(genre.id)}>
                <Icon source={Remove} tint={colors.error} size={24} />
              </IconButton>
            </ListItem.TrailingContent>
          </ListItem>
        ))}

        <HorizontalDivider modifiers={[padding(0, 8, 0, 8)]} />

        <ComposeText style={{ typography: "titleMedium" }} modifiers={[padding(0, 8, 0, 8)]}>
          Available Genres
        </ComposeText>
        {otherGenres.map((genre) => (
          <ListItem
            key={genre.id}
            colors={{ containerColor: "transparent" }}
            modifiers={[clickable(() => addFavoriteGenre(genre.id))]}
          >
            <ListItem.HeadlineContent>
              <ComposeText>{genre.name}</ComposeText>
            </ListItem.HeadlineContent>
            <ListItem.SupportingContent>
              <ComposeText>
                {genre.gameCount} {genre.gameCount === 1 ? "game" : "games"}
              </ComposeText>
            </ListItem.SupportingContent>
            <ListItem.TrailingContent>
              <IconButton onClick={() => addFavoriteGenre(genre.id)}>
                <Icon source={AddCircle} tint={colors.brandAccent} size={24} />
              </IconButton>
            </ListItem.TrailingContent>
          </ListItem>
        ))}
      </LazyColumn>
    </Host>
  )
}
