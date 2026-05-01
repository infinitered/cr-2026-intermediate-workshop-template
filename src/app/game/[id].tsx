import { useLayoutEffect } from "react"
import { Pressable, Share, ViewStyle } from "react-native"
import { useLocalSearchParams, useNavigation, Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { GameDetailScreen } from "@/screens/GameDetailScreen"
import { useGameDetail } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"

export default function GameDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme } = useAppTheme()
  const { data: game } = useGameDetail(Number(id))
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            if (!game) return
            const message = game.website
              ? `Check out ${game.name}! ${game.website}`
              : `Check out ${game.name}!`
            Share.share({ message })
          }}
          hitSlop={8}
          style={$shareButton}
        >
          <Ionicons
            name="share-social-outline"
            size={24}
            color={theme.colors.brandSurfaceText}
          />
        </Pressable>
      ),
    })
  }, [navigation, game, theme.colors.brandSurfaceText])

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

const $shareButton: ViewStyle = {}
