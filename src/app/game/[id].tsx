import { Platform, Share, ViewStyle } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"

import { GameDetailScreen } from "@/screens/GameDetailScreen"
import { useGameDetail } from "@/services/api/games"
import ShareAndroid from "@expo/material-symbols/share.xml"

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: game } = useGameDetail(Number(id))

  return (
    <>
      <Stack.Screen
        options={{
          title: game?.name ?? "Game Detail",
          ...(Platform.OS === "ios"
            ? { headerTransparent: true, title: "" }
            : { headerShown: true }),
          headerBackTitle: "Back",
        }}
      />
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

const $shareButton: ViewStyle = {}
