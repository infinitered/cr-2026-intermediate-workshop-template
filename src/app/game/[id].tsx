import { useLocalSearchParams, Stack } from "expo-router"

import { GameDetailScreen } from "@/screens/GameDetailScreen"
import { useGameDetail } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme } = useAppTheme()
  const { data: game } = useGameDetail(Number(id))

  return (
    <>
      <Stack.Screen
        options={{
          title: game?.name ?? "Game Detail",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <GameDetailScreen id={Number(id)} />
    </>
  )
}
