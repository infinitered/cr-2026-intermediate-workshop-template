import { Stack } from "expo-router"

import { FavoriteGenresScreen } from "@/screens/FavoriteGenresScreen"
import { useAppTheme } from "@/theme/context"

export default function FavoriteGenresRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Favorite Genres",
          headerBackTitle: "Queue",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <FavoriteGenresScreen />
    </>
  )
}
