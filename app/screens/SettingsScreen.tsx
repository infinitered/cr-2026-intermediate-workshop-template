import { useState } from "react"
import { Platform, Pressable, View, ViewStyle, TextStyle } from "react-native"
import { router } from "expo-router"
import DateTimePicker from "@react-native-community/datetimepicker"
import Slider from "@react-native-community/slider"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Switch } from "@/components/Toggle/Switch"
import { useSettings } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export function SettingsScreen() {
  const { themed, theme } = useAppTheme()
  const {
    displayName,
    setDisplayName,
    birthDate,
    setBirthDate,
    hideMature,
    setHideMature,
    minRating,
    setMinRating,
    shippingAddress,
    setShippingAddress,
  } = useSettings()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const dateValue = birthDate ? new Date(birthDate) : new Date()
  const formattedDate = birthDate ? dateValue.toLocaleDateString() : "Not set"

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

      <View style={themed($dateRow)}>
        <Text preset="bold" text="Birth Date" />
        {Platform.OS === "ios" ? (
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="compact"
            maximumDate={new Date()}
            onChange={(_event, date) => date && setBirthDate(date.toISOString())}
          />
        ) : (
          <>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={themed($dateText)} text={formattedDate} />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dateValue}
                mode="date"
                maximumDate={new Date()}
                onChange={(_event, date) => {
                  setShowDatePicker(false)
                  if (date) setBirthDate(date.toISOString())
                }}
              />
            )}
          </>
        )}
      </View>

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

      <View style={themed($separator)} />
      {/* Queue Preferences */}
      <Text preset="subheading" text="Queue Preferences" style={themed($sectionHeader)} />
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
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $sectionHeader: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $dateRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.sm,
})

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
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
