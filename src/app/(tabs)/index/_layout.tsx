import { Platform } from "react-native"
import { Stack } from "expo-router"

export default function GamesStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Games",
          headerLargeTitle: true,
          ...(Platform.OS === "ios" && { headerTransparent: true }),
        }}
      />
    </Stack>
  )
}
