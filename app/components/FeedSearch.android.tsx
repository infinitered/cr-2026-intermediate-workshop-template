import { View, type ViewStyle } from "react-native"
import { DockedSearchBar, Host, Icon, Text } from "@expo/ui/jetpack-compose"

import { useAppTheme } from "@/theme/context"
import { useToolbarIcons } from "@/utils/useToolbarIcons"

export function FeedSearch({ onChangeText }: { onChangeText: (t: string) => void }) {
  const { theme, themeContext } = useAppTheme()
  const searchIcon = useToolbarIcons(theme.colors.text)("search")

  return (
    <View style={$wrapper}>
      {/* Pin the Compose color scheme to the app theme, or the bar follows the device
          appearance (renders dark while the app is in light mode). */}
      <Host useViewportSizeMeasurement style={$host} colorScheme={themeContext}>
        <DockedSearchBar onQueryChange={onChangeText}>
          <DockedSearchBar.LeadingIcon>
            {searchIcon ? <Icon source={searchIcon} size={24} /> : null}
          </DockedSearchBar.LeadingIcon>
          <DockedSearchBar.Placeholder>
            <Text>Search games</Text>
          </DockedSearchBar.Placeholder>
        </DockedSearchBar>
      </Host>
    </View>
  )
}

const $wrapper: ViewStyle = { height: 72, paddingHorizontal: 16, paddingVertical: 8 }
const $host: ViewStyle = { flex: 1 }
