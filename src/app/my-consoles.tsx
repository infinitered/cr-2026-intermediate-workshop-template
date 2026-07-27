import { Stack } from "expo-router"

import { MyConsolesScreen } from "@/screens/MyConsolesScreen"
import { useAppTheme } from "@/theme/context"

export default function MyConsolesRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Consoles",
          headerBackTitle: "Queue",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <MyConsolesScreen />
    </>
  )
}
