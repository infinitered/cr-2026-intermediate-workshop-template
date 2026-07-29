import { Stack } from "expo-router"

import { useAppTheme } from "@/theme/context"
import { typeScale } from "@/theme/typography"

export default function HomeStackLayout() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.brandSurface },
        headerTintColor: colors.brandSurfaceText,
        headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Games" }} />
    </Stack>
  )
}
