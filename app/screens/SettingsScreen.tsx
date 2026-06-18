import type { ViewStyle } from "react-native"
import { router } from "expo-router"
// prettier-ignore
import { Host, FieldGroup, TextInput, Switch, Slider, Button, Row, Column, Text, RNHostView, Spacer } from "@expo/ui"
import DateTimePicker from "@react-native-community/datetimepicker"

import { Screen } from "@/components/Screen"
import { useSettings } from "@/stores/settings"

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
            <Row alignment="center">
              <Text>Birth Date</Text>
              <Spacer />
              <RNHostView matchContents>
                <DateTimePicker
                  value={dateValue}
                  mode="date"
                  display="compact"
                  maximumDate={new Date()}
                  onChange={(_event, date) => date && setBirthDate(date.toISOString())}
                />
              </RNHostView>
            </Row>
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
            <Row spacing={8}>
              <TextInput
                placeholder="State"
                defaultValue={shippingAddress.state}
                onChangeText={(v) => setShippingAddress({ state: v.toUpperCase().slice(0, 2) })}
                autoCapitalize="characters"
                maxLength={2}
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
            </Row>
          </FieldGroup.Section>

          <FieldGroup.Section title="Queue Preferences">
            <Switch value={hideMature} onValueChange={setHideMature} label="Hide Mature Content" />
            <Column>
              <Text>{`Minimum Rating: ${minRating} / 5`}</Text>
              <Slider value={minRating} onValueChange={setMinRating} min={1} max={5} step={1} />
            </Column>
            <Button label="Favorite Genres" onPress={() => router.push("/favorite-genres")} />
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
