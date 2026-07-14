import { Stack } from "expo-router"
import { Platform } from "react-native"

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Games",
          headerLargeTitleEnabled: true,
          ...(Platform.OS === "ios" && { headerTransparent: true }),
          headerBlurEffect: "systemUltraThinMaterial",
        }}
      />
    </Stack>
  )
}
