import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { router } from "expo-router"
import Slider from "@react-native-community/slider"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Switch } from "@/components/Toggle/Switch"
import { useSettings } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const SORT_OPTIONS = ["Rating", "Name", "Release Date"] as const

export function SettingsScreen() {
  const { themed, theme, themeContext, setThemeContextOverride } = useAppTheme()
  const {
    displayName,
    setDisplayName,
    hideMature,
    setHideMature,
    minRating,
    setMinRating,
    sortOrder,
    setSortOrder,
    shippingAddress,
    setShippingAddress,
  } = useSettings()
  const isDarkMode = themeContext === "dark"

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

      {/* Shipping Address */}
      <Text preset="subheading" text="Shipping Address" style={themed($sectionHeader)} />
      <View style={themed($addressFields)}>
        <TextField
          label="Street Address"
          placeholder="123 Main St"
          value={shippingAddress.street1}
          onChangeText={(v) => setShippingAddress({ street1: v })}
          autoCapitalize="words"
        />
        <TextField
          label="Apt / Suite / Unit"
          placeholder="Apt 4B"
          value={shippingAddress.street2}
          onChangeText={(v) => setShippingAddress({ street2: v })}
          autoCapitalize="words"
        />
        <TextField
          label="City"
          placeholder="Springfield"
          value={shippingAddress.city}
          onChangeText={(v) => setShippingAddress({ city: v })}
          autoCapitalize="words"
        />
        <View style={$cityStateRow}>
          <View style={$stateField}>
            <TextField
              label="State"
              placeholder="CA"
              value={shippingAddress.state}
              onChangeText={(v) => setShippingAddress({ state: v.toUpperCase().slice(0, 2) })}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
          <View style={$zipField}>
            <TextField
              label="ZIP Code"
              placeholder="90210"
              value={shippingAddress.zip}
              onChangeText={(v) =>
                setShippingAddress({ zip: v.replace(/[^0-9]/g, "").slice(0, 5) })
              }
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      <View style={themed($separator)} />

      {/* Appearance */}
      <Text preset="subheading" text="Appearance" style={themed($sectionHeader)} />
      <View style={themed($toggleRow)}>
        <Text preset="bold" text="Dark Mode" />
        <Switch
          value={isDarkMode}
          onValueChange={(value) => setThemeContextOverride(value ? "dark" : "light")}
        />
      </View>

      <View style={themed($separator)} />

      {/* Content Preferences */}
      <Text preset="subheading" text="Content Preferences" style={themed($sectionHeader)} />

      <View style={themed($toggleRow)}>
        <Text preset="bold" text="Hide Mature Content" />
        <Switch value={hideMature} onValueChange={setHideMature} />
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
      {/* Queue Preferences */}
      <Text preset="subheading" text="Queue Preferences" style={themed($sectionHeader)} />

      <View style={themed($sliderRow)}>
        <Text preset="bold" text={`Minimum Rating: ${minRating} / 5`} />
        <Slider
          style={$slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={minRating}
          onValueChange={setMinRating}
          minimumTrackTintColor={theme.colors.brandSurface}
          maximumTrackTintColor={theme.colors.trackInactive}
          thumbTintColor={theme.colors.brandSurface}
        />
      </View>
      <Button
        text="Favorite Genres"
        preset="default"
        style={themed($queuePrefButton)}
        onPress={() => router.push("/favorite-genres")}
      />
      <Button
        text="Muted Keywords"
        preset="default"
        style={themed($queuePrefButton)}
        onPress={() => router.push("/muted-keywords")}
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

const $sortPill: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
  borderRadius: spacing.md,
  borderWidth: 2,
  borderColor: colors.brandBorder,
})

const $sortPillSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.brandAccent,
})

const $sortPillUnselected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.brandSurface,
})

const $sortPillTextSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccentText,
})

const $sortPillTextUnselected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandSurfaceText,
})

const $queuePrefButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandSurface,
  borderRadius: spacing.xs,
  marginTop: spacing.xs,
})

const $addressFields: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $cityStateRow: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $stateField: ViewStyle = {
  flex: 1,
}

const $zipField: ViewStyle = {
  flex: 2,
}

const $separator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
})
