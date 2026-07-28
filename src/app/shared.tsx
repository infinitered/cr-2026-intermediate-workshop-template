import { Stack } from "expo-router"

import { SharedContentScreen } from "@/screens/SharedContentScreen"

export default function SharedRoute() {
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
