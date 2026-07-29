import { View, type ViewStyle } from "react-native"
import { DockedSearchBar, Host, Icon, Text } from "@expo/ui/jetpack-compose"

import { useToolbarIcons } from "@/utils/useToolbarIcons"

import type { FeedSearchProps } from "@/components/FeedSearch"
import { colors } from "@/theme/colors"

export function FeedSearch({ onChangeText }: FeedSearchProps) {
  const searchIcon = useToolbarIcons(colors.text)("search")

  return (
    <View style={$wrapper}>
      {/* Pin the Compose color scheme to the app theme, or the bar follows the device
          appearance (renders dark while the app is in light mode). */}
      <Host useViewportSizeMeasurement style={$host}>
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
