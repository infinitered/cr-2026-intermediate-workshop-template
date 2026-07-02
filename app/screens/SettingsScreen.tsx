import { ViewStyle } from "react-native"
import { router } from "expo-router"

import { Screen } from "@/components/Screen"
import { useSettings } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Host, FieldGroup, TextInput, Switch, Slider, Button, Column, Text } from "@expo/ui"
import { DatePicker } from "@/components/DatePicker"

export function SettingsScreen() {
  const { themed } = useAppTheme()
  const {
    displayName,
    setDisplayName,
    hideMature,
    setHideMature,
    minRating,
    setMinRating,
    shippingAddress,
    setShippingAddress,
    birthDate,
    setBirthDate,
  } = useSettings()

  return (
    <Screen preset="fixed" contentContainerStyle={themed($container)}>
      <Host style={$hostFill}>
        <FieldGroup>
          <FieldGroup.Section title="Profile">
            <TextInput
              placeholder="Enter your name"
              defaultValue={displayName}
              onChangeText={setDisplayName}
            />
            <DatePicker
              title="Birth Date"
              value={birthDate ? new Date(birthDate) : new Date()}
              onDateChange={(date) => setBirthDate(date.toISOString())}
              maximumDate={new Date()}
            />
          </FieldGroup.Section>

          <FieldGroup.Section title="Shipping Address">
            <TextInput
              placeholder="Street Address"
              defaultValue={shippingAddress.street1}
              onChangeText={(v) => setShippingAddress({ street1: v })}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Apt / Suite / Unit"
              defaultValue={shippingAddress.street2}
              onChangeText={(v) => setShippingAddress({ street2: v })}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="City"
              defaultValue={shippingAddress.city}
              onChangeText={(v) => setShippingAddress({ city: v })}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="State"
              defaultValue={shippingAddress.state}
              onChangeText={(v) => setShippingAddress({ state: v })}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="ZIP Code"
              defaultValue={shippingAddress.zip}
              onChangeText={(v) =>
                setShippingAddress({ zip: v.replace(/[^0-9]/g, "").slice(0, 5) })
              }
              keyboardType="number-pad"
              maxLength={5}
            />
          </FieldGroup.Section>

          <FieldGroup.Section title="Queue Preferences">
            <Switch value={hideMature} onValueChange={setHideMature} label="Hide Mature Content" />
            <Column>
              <Text>{`Minimum Rating: ${minRating} / 5`}</Text>
              <Slider value={minRating} onValueChange={setMinRating} min={1} max={5} step={1} />
            </Column>
            <Button
              variant="text"
              label="Set Favorite Genres"
              onPress={() => router.push("/favorite-genres")}
            />
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $hostFill: ViewStyle = {
  flex: 1,
}
