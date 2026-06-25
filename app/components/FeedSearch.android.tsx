import { View, type ViewStyle } from "react-native"
import { DockedSearchBar, Host, Icon, Text } from "@expo/ui/jetpack-compose"

import { useAppTheme } from "@/theme/context"
import { useToolbarIcons } from "@/utils/useToolbarIcons"

export type FeedSearchProps = {
  /** Called live as the query changes. */
  onChangeText: (text: string) => void
}

/**
 * Android feed search: a Material `DockedSearchBar`. It stays in place (never
 * expands — the native view hardcodes `expanded = false`) and reports the query
 * live via `onQueryChange`, mirroring the in-place filtering of the iOS bottom
 * search pill. iOS uses the bottom `Stack.Toolbar` search instead.
 */
export function FeedSearch({ onChangeText }: FeedSearchProps) {
  const { theme, themeContext } = useAppTheme()
  const toolbarIcon = useToolbarIcons(theme.colors.text)
  const searchIcon = toolbarIcon("search")

  return (
    <View style={$wrapper}>
      {/* Pin the Compose color scheme to the app theme — otherwise the search bar follows the
          device appearance and renders dark while the app is in light mode. */}
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

const $wrapper: ViewStyle = {
  height: 72,
  paddingHorizontal: 16,
  paddingVertical: 8,
}

const $host: ViewStyle = {
  flex: 1,
}
