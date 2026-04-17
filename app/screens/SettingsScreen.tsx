import { useState } from "react"
import { Alert, TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import Slider from "@react-native-community/slider"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Switch } from "@/components/Toggle/Switch"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const SORT_OPTIONS = ["Rating", "Name", "Release Date"] as const
type SortOrder = (typeof SORT_OPTIONS)[number]

export function SettingsScreen() {
  const { themed, theme } = useAppTheme()

  const [displayName, setDisplayName] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [hideMature, setHideMature] = useState(false)
  const [minRating, setMinRating] = useState(3)
  const [sortOrder, setSortOrder] = useState<SortOrder>("Rating")

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      {/* Profile */}
      <Text preset="subheading" text="Profile" style={themed($sectionHeader)} />
      <TextField
        label="Display Name"
        placeholder="Enter your name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <View style={themed($separator)} />

      {/* Appearance */}
      <Text preset="subheading" text="Appearance" style={themed($sectionHeader)} />
      <View style={themed($toggleRow)}>
        <Text preset="bold" text="Dark Mode" />
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={themed($separator)} />

      {/* Content Preferences */}
      <Text preset="subheading" text="Content Preferences" style={themed($sectionHeader)} />

      <View style={themed($toggleRow)}>
        <Text preset="bold" text="Hide Mature Content" />
        <Switch value={hideMature} onValueChange={setHideMature} />
      </View>

      <View style={themed($sliderRow)}>
        <Text preset="bold" text={`Minimum Rating: ${minRating} / 5`} />
        <Slider
          style={$slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={minRating}
          onValueChange={setMinRating}
          minimumTrackTintColor={theme.colors.palette.lemon500}
          maximumTrackTintColor={theme.colors.palette.purpleMuted500}
          thumbTintColor={theme.colors.palette.lemon500}
        />
      </View>

      <View style={themed($sliderRow)}>
        <Text preset="bold" text="Sort Order" />
        <View style={$sortRow}>
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortOrder === option
            return (
              <TouchableOpacity
                key={option}
                style={[
                  themed($sortPill),
                  themed(isSelected ? $sortPillSelected : $sortPillUnselected),
                ]}
                onPress={() => setSortOrder(option)}
              >
                <Text
                  text={option}
                  size="xs"
                  style={themed(isSelected ? $sortPillTextSelected : $sortPillTextUnselected)}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <View style={themed($separator)} />

      {/* Actions */}
      <Text preset="subheading" text="Actions" style={themed($sectionHeader)} />
      <Button
        text="Clear Favorites"
        preset="default"
        onPress={() => Alert.alert("Favorites Cleared", "All favorites have been removed.")}
        style={themed($button)}
      />
      <Button
        text="About"
        preset="default"
        onPress={() =>
          Alert.alert(
            "Game Vault",
            "Version 1.0.0\nBuilt with Ignite + Expo\nA CR 2026 Workshop App",
          )
        }
        style={themed($button)}
      />
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $sectionHeader: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $toggleRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.sm,
})

const $sliderRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
  gap: spacing.xs,
})

const $slider: ViewStyle = {
  width: "100%",
  height: 40,
}

const $sortRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $sortPill: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
})

const $sortPillSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.lemon500,
})

const $sortPillUnselected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 1,
  borderColor: colors.separator,
})

const $sortPillTextSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.purpleMuted900,
})

const $sortPillTextUnselected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})
