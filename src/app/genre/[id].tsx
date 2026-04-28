import { useLocalSearchParams, Stack } from "expo-router"

import { GenreDetailScreen } from "@/screens/GenreDetailScreen"
import { useFeedGenres } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"

export default function GenreDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme } = useAppTheme()
  const { data: genres } = useFeedGenres()
  const genre = genres?.find((g) => g.id === Number(id))

  return (
    <>
      <Stack.Screen
        options={{
          title: genre?.name ?? "Genre",
          headerBackTitle: "Genres",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <GenreDetailScreen id={Number(id)} />
    </>
  )
}
