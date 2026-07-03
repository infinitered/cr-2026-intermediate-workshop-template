import { ActivityIndicator, ViewStyle } from "react-native"
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

import { Screen } from "@/components/Screen"
import { type FeedGenre, useFeedGenres } from "@/services/api/games"
import { useFavoriteGenres } from "@/stores/favoriteGenres"
import { useAppTheme } from "@/theme/context"

export function FavoriteGenresScreen() {
  const { theme, themeContext } = useAppTheme()
  const { data: allGenres = [], isLoading } = useFeedGenres()
  const { ids: favoriteIds, addFavoriteGenre, removeFavoriteGenre } = useFavoriteGenres()
  const isDarkMode = themeContext === "dark"

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

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn contentPadding={{ start: 16, end: 16, bottom: 24 }}>
        <ComposeText style={{ typography: "titleMedium" }} modifiers={[padding(0, 16, 0, 8)]}>
          Your Favorites
        </ComposeText>

        {favoriteGenres.length === 0 ? (
          <ComposeText
            color={theme.colors.textDim}
            style={{ typography: "bodyMedium" }}
            modifiers={[padding(0, 4, 0, 12)]}
          >
            Add genres below to personalize recommendations
          </ComposeText>
        ) : (
          favoriteGenres.map((genre) => (
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
                  <Icon
                    source={require("../../assets/icons/remove-circle.xml")}
                    tint={theme.colors.error}
                    size={24}
                  />
                </IconButton>
              </ListItem.TrailingContent>
            </ListItem>
          ))
        )}

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
                <Icon
                  source={require("../../assets/icons/add-circle.xml")}
                  tint={theme.colors.brandAccent}
                  size={24}
                />
              </IconButton>
            </ListItem.TrailingContent>
          </ListItem>
        ))}
      </LazyColumn>
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
