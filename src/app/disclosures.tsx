import { Stack } from "expo-router"

import { DisclosuresScreen } from "@/screens/DisclosuresScreen"
import { useAppTheme } from "@/theme/context"
import { typeScale } from "@/theme/typography"

export default function DisclosuresRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Disclosures",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: theme.colors.brandSurface,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.brandBorder,
          },
          headerTintColor: theme.colors.brandSurfaceText,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
        }}
      />
      <DisclosuresScreen />
    </>
  )
}
