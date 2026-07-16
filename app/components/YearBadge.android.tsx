import { View, ViewStyle } from "react-native"
import { Color } from "expo-router"

import { Text } from "@/components/Text"
import { useDynamicColors } from "@/utils/useDynamicColors"

interface YearBadgeProps {
  year: string
}

export function YearBadge({ year }: YearBadgeProps) {
  useDynamicColors()

  return (
    <View style={$badge}>
      <Text weight="bold" size="xxs" style={$badgeText}>
        {year}
      </Text>
    </View>
  )
}

const $badge: ViewStyle = {
  alignSelf: "flex-start",
  backgroundColor: Color.android.dynamic.primaryContainer,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: Color.android.dynamic.outline,
  paddingHorizontal: 12,
  paddingVertical: 4,
  marginBottom: 8,
  marginLeft: 16,
}

const $badgeText = {
  color: Color.android.dynamic.onPrimaryContainer,
}
