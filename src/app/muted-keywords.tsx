import { Stack } from "expo-router"

import { MutedKeywordsScreen } from "@/screens/MutedKeywordsScreen"
import { useAppTheme } from "@/theme/context"

export default function MutedKeywordsRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Muted Keywords",
          headerBackTitle: "Queue",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <MutedKeywordsScreen />
    </>
  )
}
