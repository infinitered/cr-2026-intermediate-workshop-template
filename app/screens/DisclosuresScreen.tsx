import { Linking, TextStyle, View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const LIBRARIES = [
  { name: "Expo", description: "Framework and platform for React Native apps" },
  { name: "Expo Router", description: "File-based routing for React Native" },
  { name: "React Query", description: "Async state management and data fetching" },
  { name: "React Native MMKV", description: "Fast key-value storage" },
  { name: "React Native Reanimated", description: "Smooth animations and transitions" },
  { name: "Ignite", description: "Battle-tested React Native boilerplate by Infinite Red" },
] as const

export function DisclosuresScreen() {
  const { themed } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <Text preset="subheading" text="Data" style={themed($sectionHeader)} />
      <Text>Game data provided by the RAWG Video Games Database API.</Text>
      <Text
        style={themed($link)}
        text="rawg.io"
        onPress={() => Linking.openURL("https://rawg.io")}
      />

      <View style={themed($separator)} />

      <Text preset="subheading" text="Libraries" style={themed($sectionHeader)} />
      {LIBRARIES.map((lib) => (
        <View key={lib.name} style={themed($libraryRow)}>
          <Text preset="bold" text={lib.name} />
          <Text text={lib.description} />
        </View>
      ))}
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $sectionHeader: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $link: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  textDecorationLine: "underline",
  marginTop: spacing.xs,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
})

const $libraryRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})
