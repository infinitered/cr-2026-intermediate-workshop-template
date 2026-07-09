import { Stack } from "expo-router"

export default function GamesStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Games", headerLargeTitle: true, headerTransparent: true }}
      />
    </Stack>
  )
}
