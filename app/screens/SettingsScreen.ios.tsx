import { router } from "expo-router"
import {
  Host,
  Form,
  Section,
  TextField,
  Toggle,
  Picker,
  Slider,
  DatePicker,
  Text as SwiftText,
} from "@expo/ui/swift-ui"
import { pickerStyle, tag, onTapGesture, contentShape, shapes } from "@expo/ui/swift-ui/modifiers"

import { useSettings } from "@/stores/settings"
import { useAppTheme } from "@/theme/context"

const SORT_OPTIONS = ["Rating", "Name", "Release Date"] as const

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
]

export function SettingsScreen() {
  const { themeContext, setThemeContextOverride } = useAppTheme()
  const {
    displayName,
    setDisplayName,
    birthDate,
    setBirthDate,
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

  const dateValue = birthDate ? new Date(birthDate) : new Date()

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Profile">
          <TextField
            placeholder="Display Name"
            defaultValue={displayName}
            onValueChange={setDisplayName}
          />
          <DatePicker
            title="Birth Date"
            selection={dateValue}
            displayedComponents={["date"]}
            range={{ end: new Date() }}
            onDateChange={(date) => setBirthDate(date.toISOString())}
          />
        </Section>

        <Section title="Shipping Address">
          <TextField
            placeholder="Street Address"
            defaultValue={shippingAddress.street1}
            onValueChange={(v) => setShippingAddress({ street1: v })}
          />
          <TextField
            placeholder="Apt / Suite / Unit"
            defaultValue={shippingAddress.street2}
            onValueChange={(v) => setShippingAddress({ street2: v })}
          />
          <TextField
            placeholder="City"
            defaultValue={shippingAddress.city}
            onValueChange={(v) => setShippingAddress({ city: v })}
          />
          <Picker
            label="State"
            selection={shippingAddress.state || ""}
            onSelectionChange={(sel) => setShippingAddress({ state: String(sel) })}
            modifiers={[pickerStyle("menu")]}
          >
            {US_STATES.map((s) => (
              <SwiftText key={s.abbr} modifiers={[tag(s.abbr)]}>
                {s.name}
              </SwiftText>
            ))}
          </Picker>
          <TextField
            placeholder="ZIP Code"
            defaultValue={shippingAddress.zip}
            onValueChange={(v) => setShippingAddress({ zip: v.replace(/[^0-9]/g, "").slice(0, 5) })}
          />
        </Section>

        <Section title="Content Preferences">
          <Toggle label="Hide Mature Content" isOn={hideMature} onIsOnChange={setHideMature} />
          <Picker
            label="Sort Order"
            selection={sortOrder}
            onSelectionChange={(sel) => setSortOrder(sel as (typeof SORT_OPTIONS)[number])}
            modifiers={[pickerStyle("menu")]}
          >
            {SORT_OPTIONS.map((option) => (
              <SwiftText key={option} modifiers={[tag(option)]}>
                {option}
              </SwiftText>
            ))}
          </Picker>
        </Section>

        <Section
          title="Queue Preferences"
          footer={<SwiftText>Only games rated {minRating}+ out of 5 will be suggested.</SwiftText>}
        >
          <Slider
            value={minRating}
            min={1}
            max={5}
            step={1}
            label={<SwiftText>Minimum Rating: {minRating}</SwiftText>}
            minimumValueLabel={<SwiftText>1</SwiftText>}
            maximumValueLabel={<SwiftText>5</SwiftText>}
            onValueChange={setMinRating}
          />
          <SwiftText
            modifiers={[
              contentShape(shapes.rectangle()),
              onTapGesture(() => router.push("/favorite-genres")),
            ]}
          >
            Favorite Genres
          </SwiftText>
          <SwiftText
            modifiers={[
              contentShape(shapes.rectangle()),
              onTapGesture(() => router.push("/muted-keywords")),
            ]}
          >
            Muted Keywords
          </SwiftText>
        </Section>

        <Section title="Appearance">
          <Toggle
            label="Dark Mode"
            isOn={isDarkMode}
            onIsOnChange={(value) => setThemeContextOverride(value ? "dark" : "light")}
          />
        </Section>
      </Form>
    </Host>
  )
}
