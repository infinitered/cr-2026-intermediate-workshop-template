import { Stack } from "expo-router"

import { SharedContentScreen } from "@/screens/SharedContentScreen"
import { useAppTheme } from "@/theme/context"

export default function SharedRoute() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add a Game",
          headerShown: true,
        }}
      />
      <SharedContentScreen />
    </>
  )
}
