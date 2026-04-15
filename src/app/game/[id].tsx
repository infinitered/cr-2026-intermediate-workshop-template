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
          headerStyle: { backgroundColor: theme.colors.palette.lemon500 },
          headerTintColor: theme.colors.palette.purpleMuted900,
        }}
      />
      <GameDetailScreen id={Number(id)} />
    </>
  )
}
