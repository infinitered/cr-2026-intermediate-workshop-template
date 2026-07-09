import { Stack } from "expo-router"

export default function QueueStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Queue" }} />
    </Stack>
  )
}
