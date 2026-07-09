import { Platform, Share } from "react-native"
import { useLocalSearchParams, Stack, router } from "expo-router"
import ShareAndroid from "@expo/material-symbols/share.xml"

import { GameDetailScreen } from "@/screens/GameDetailScreen"
import { useGameDetail } from "@/services/api/games"

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: game } = useGameDetail(Number(id))

  return (
    <>
      <Stack.Screen options={{ headerTransparent: true, title: "" }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={Platform.OS === "ios" ? "chevron.backward" : undefined}
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={Platform.OS === "ios" ? "square.and.arrow.up" : ShareAndroid}
          onPress={() => {
            if (!game) return
            const message = game.website
              ? `Check out ${game.name}! ${game.website}`
              : `Check out ${game.name}!`
            Share.share({ message })
          }}
        />
      </Stack.Toolbar>
      <GameDetailScreen id={Number(id)} />
    </>
  )
}
