import { Text, useColorScheme, View, ViewStyle } from "react-native"
import { Color } from "expo-router"

interface YearBadgeProps {
  year: string
}

export function YearBadge({ year }: YearBadgeProps) {
  useColorScheme()

  return (
    <View style={$badge}>
      <Text style={$badgeText}>{year}</Text>
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
  fontWeight: "bold" as const,
  fontSize: 12,
}
