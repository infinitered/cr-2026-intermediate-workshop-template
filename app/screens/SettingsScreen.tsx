import type { ViewStyle } from "react-native"
import { router } from "expo-router"
// prettier-ignore
import { Host, FieldGroup, TextInput, Switch, Slider, Button, Column, Text, Row } from "@expo/ui"

import { Screen } from "@/components/Screen"
import { useSettings } from "@/stores/settings"
import { DatePicker } from "@/components/settings/DatePicker"
import { Dropdown } from "@/components/settings/Dropdown"
import { US_STATES } from "@/utils/usStates"

export function SettingsScreen() {
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

  const dateValue = birthDate ? new Date(birthDate) : new Date()

  return (
    <Screen preset="fixed" contentContainerStyle={$screenContent}>
      <Host style={$host} useViewportSizeMeasurement>
        <FieldGroup>
          <FieldGroup.Section title="Profile">
            <TextInput
              placeholder="Enter your name"
              defaultValue={displayName}
              onChangeText={setDisplayName}
            />
            <DatePicker
              title="Birth Date"
              value={dateValue}
              onDateChange={(date: Date) => setBirthDate(date.toISOString())}
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
            <Dropdown
              title="State"
              items={US_STATES}
              selectedValue={shippingAddress.state}
              onValueChange={(v: string) => setShippingAddress({ state: v })}
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

const $screenContent: ViewStyle = {
  flex: 1,
}

const $host: ViewStyle = {
  flex: 1,
}
