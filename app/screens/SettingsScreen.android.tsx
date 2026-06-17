import { useState } from "react"
import { ViewStyle } from "react-native"
import { router } from "expo-router"
import {
  Host,
  Column,
  Text as ComposeText,
  OutlinedTextField,
  Switch,
  Slider,
  Button,
  HorizontalDivider,
  ListItem,
  DatePickerDialog,
  ExposedDropdownMenuBox,
  ExposedDropdownMenu,
  DropdownMenuItem,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
} from "@expo/ui/jetpack-compose"
import {
  paddingAll,
  fillMaxWidth,
  clickable,
  verticalScroll,
  menuAnchor,
} from "@expo/ui/jetpack-compose/modifiers"

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
  const { theme, themeContext, setThemeContextOverride } = useAppTheme()
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
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [stateExpanded, setStateExpanded] = useState(false)

  const selectedStateName =
    US_STATES.find((s) => s.abbr === shippingAddress.state)?.name || shippingAddress.state || ""

  return (
    <Host
      style={[$host, { backgroundColor: theme.colors.background }]}
      colorScheme={isDarkMode ? "dark" : "light"}
      seedColor={theme.colors.palette.purple700}
    >
      <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[paddingAll(16), verticalScroll()]}>
        {/* Profile */}
        <ComposeText color={theme.colors.text} style={{ typography: "titleMedium" }}>
          Profile
        </ComposeText>

        <OutlinedTextField onValueChange={setDisplayName} modifiers={[fillMaxWidth()]}>
          <OutlinedTextField.Label>
            <ComposeText>Display Name</ComposeText>
          </OutlinedTextField.Label>
          <OutlinedTextField.Placeholder>
            <ComposeText>{displayName || "Enter your name"}</ComposeText>
          </OutlinedTextField.Placeholder>
        </OutlinedTextField>

        <ListItem
          colors={{ containerColor: "transparent" }}
          modifiers={[clickable(() => setShowDatePicker(true))]}
        >
          <ListItem.HeadlineContent>
            <ComposeText>Birth Date</ComposeText>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <ComposeText>
              {birthDate ? new Date(birthDate).toLocaleDateString() : "Not set"}
            </ComposeText>
          </ListItem.TrailingContent>
        </ListItem>
        {showDatePicker && (
          <DatePickerDialog
            initialDate={birthDate || null}
            onDateSelected={(date) => {
              setBirthDate(date.toISOString())
              setShowDatePicker(false)
            }}
            onDismissRequest={() => setShowDatePicker(false)}
            selectableDates={{ end: new Date() }}
          />
        )}

        <HorizontalDivider />

        {/* Shipping Address */}
        <ComposeText color={theme.colors.text} style={{ typography: "titleMedium" }}>
          Shipping Address
        </ComposeText>

        <OutlinedTextField
          onValueChange={(v) => setShippingAddress({ street1: v })}
          modifiers={[fillMaxWidth()]}
        >
          <OutlinedTextField.Label>
            <ComposeText>Street Address</ComposeText>
          </OutlinedTextField.Label>
          <OutlinedTextField.Placeholder>
            <ComposeText>{shippingAddress.street1 || "123 Main St"}</ComposeText>
          </OutlinedTextField.Placeholder>
        </OutlinedTextField>

        <OutlinedTextField
          onValueChange={(v) => setShippingAddress({ street2: v })}
          modifiers={[fillMaxWidth()]}
        >
          <OutlinedTextField.Label>
            <ComposeText>Apt / Suite / Unit</ComposeText>
          </OutlinedTextField.Label>
          <OutlinedTextField.Placeholder>
            <ComposeText>{shippingAddress.street2 || "Apt 4B"}</ComposeText>
          </OutlinedTextField.Placeholder>
        </OutlinedTextField>

        <OutlinedTextField
          onValueChange={(v) => setShippingAddress({ city: v })}
          modifiers={[fillMaxWidth()]}
        >
          <OutlinedTextField.Label>
            <ComposeText>City</ComposeText>
          </OutlinedTextField.Label>
          <OutlinedTextField.Placeholder>
            <ComposeText>{shippingAddress.city || "Springfield"}</ComposeText>
          </OutlinedTextField.Placeholder>
        </OutlinedTextField>

        <ExposedDropdownMenuBox expanded={stateExpanded} onExpandedChange={setStateExpanded}>
          <OutlinedTextField
            defaultValue={selectedStateName || "Select state"}
            readOnly
            modifiers={[menuAnchor(), fillMaxWidth()]}
          >
            <OutlinedTextField.Label>
              <ComposeText>State</ComposeText>
            </OutlinedTextField.Label>
          </OutlinedTextField>
          <ExposedDropdownMenu
            expanded={stateExpanded}
            onDismissRequest={() => setStateExpanded(false)}
          >
            {US_STATES.map((s) => (
              <DropdownMenuItem
                key={s.abbr}
                onClick={() => {
                  setShippingAddress({ state: s.abbr })
                  setStateExpanded(false)
                }}
              >
                <DropdownMenuItem.Text>
                  <ComposeText>{s.name}</ComposeText>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
            ))}
          </ExposedDropdownMenu>
        </ExposedDropdownMenuBox>

        <OutlinedTextField
          onValueChange={(v) => setShippingAddress({ zip: v.replace(/[^0-9]/g, "").slice(0, 5) })}
          maxLength={5}
          keyboardOptions={{ keyboardType: "number" }}
          modifiers={[fillMaxWidth()]}
        >
          <OutlinedTextField.Label>
            <ComposeText>ZIP Code</ComposeText>
          </OutlinedTextField.Label>
          <OutlinedTextField.Placeholder>
            <ComposeText>{shippingAddress.zip || "90210"}</ComposeText>
          </OutlinedTextField.Placeholder>
        </OutlinedTextField>

        <HorizontalDivider />

        {/* Content Preferences */}
        <ComposeText color={theme.colors.text} style={{ typography: "titleMedium" }}>
          Content Preferences
        </ComposeText>

        <ListItem colors={{ containerColor: "transparent" }}>
          <ListItem.HeadlineContent>
            <ComposeText>Hide Mature Content</ComposeText>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Switch value={hideMature} onCheckedChange={setHideMature} />
          </ListItem.TrailingContent>
        </ListItem>

        <ComposeText color={theme.colors.text} style={{ typography: "bodyMedium" }}>
          Sort Order
        </ComposeText>

        <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
          {SORT_OPTIONS.map((option) => (
            <SegmentedButton
              key={option}
              selected={sortOrder === option}
              onClick={() => setSortOrder(option)}
            >
              <SegmentedButton.Label>
                <ComposeText>{option}</ComposeText>
              </SegmentedButton.Label>
            </SegmentedButton>
          ))}
        </SingleChoiceSegmentedButtonRow>

        <HorizontalDivider />

        {/* Queue Preferences */}
        <ComposeText color={theme.colors.text} style={{ typography: "titleMedium" }}>
          Queue Preferences
        </ComposeText>

        <ComposeText color={theme.colors.text} style={{ typography: "bodyMedium" }}>
          Minimum Rating: {minRating} / 5
        </ComposeText>
        <Slider value={minRating} min={1} max={5} steps={3} onValueChange={setMinRating} />
        <ComposeText color={theme.colors.textDim} style={{ typography: "bodySmall" }}>
          Only games rated {minRating}+ out of 5 will be suggested.
        </ComposeText>

        <Button onClick={() => router.push("/favorite-genres")}>
          <ComposeText>Favorite Genres</ComposeText>
        </Button>

        <Button onClick={() => router.push("/muted-keywords")}>
          <ComposeText>Muted Keywords</ComposeText>
        </Button>

        <HorizontalDivider />

        {/* Appearance */}
        <ComposeText color={theme.colors.text} style={{ typography: "titleMedium" }}>
          Appearance
        </ComposeText>

        <ListItem colors={{ containerColor: "transparent" }}>
          <ListItem.HeadlineContent>
            <ComposeText>Dark Mode</ComposeText>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Switch
              value={isDarkMode}
              onCheckedChange={(value) => setThemeContextOverride(value ? "dark" : "light")}
            />
          </ListItem.TrailingContent>
        </ListItem>
      </Column>
    </Host>
  )
}

const $host: ViewStyle = {
  flex: 1,
}
