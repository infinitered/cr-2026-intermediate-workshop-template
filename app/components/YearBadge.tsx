import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface YearBadgeProps {
  year: string
}

export function YearBadge({ year }: YearBadgeProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($badge)}>
      <Text weight="bold" size="xxs" style={themed($badgeText)}>
        {year}
      </Text>
    </View>
  )
}

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.brandAccent,
  borderRadius: spacing.md,
  borderWidth: 2,
  borderColor: "#000",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  marginBottom: spacing.sm,
  marginLeft: spacing.lg,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccentText,
})
