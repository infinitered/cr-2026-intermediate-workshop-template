import { useLayoutEffect } from "react"
import { Platform, Pressable, Share, ViewStyle } from "react-native"
import { useLocalSearchParams, useNavigation, Stack, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { GameDetailScreen } from "@/screens/GameDetailScreen"
import { useGameDetail } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"
import ShareAndroid from "@expo/material-symbols/share.xml"

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme } = useAppTheme()
  const { data: game } = useGameDetail(Number(id))
  const navigation = useNavigation()

  return (
    <>
      <Stack.Screen
  options={{
    title: game?.name ?? "",
    ...(Platform.OS === "ios"
      ? { headerTransparent: true, title: "" }
      : { headerShown: true }),
  }}
/>
{Platform.OS === "ios" && (
  <Stack.Toolbar placement="left">
    <Stack.Toolbar.Button icon="chevron.backward" onPress={() => router.back()} />
  </Stack.Toolbar>
)}
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
