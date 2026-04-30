import { Stack } from "expo-router"

import { SharedContentScreen } from "@/screens/SharedContentScreen"
import { useAppTheme } from "@/theme/context"

export default function SharedRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shared",
          headerShown: true,
          presentation: "modal",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <SharedContentScreen />
    </>
  )
}
