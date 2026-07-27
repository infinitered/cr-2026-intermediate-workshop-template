import { Host, Text } from "@expo/ui/jetpack-compose"
import { useMaterialColors } from "@expo/ui/jetpack-compose"
import { background, clip, padding, Shapes } from "@expo/ui/jetpack-compose/modifiers"

interface YearBadgeProps {
  year: string
}

export function YearBadge({ year }: YearBadgeProps) {
  const colors = useMaterialColors({ seedColor: "#DBFF00" })

  return (
    <Host matchContents style={{ alignSelf: "flex-start", marginBottom: 8, marginLeft: 16 }}>
      <Text
        color={colors.onPrimaryContainer}
        modifiers={[
          clip(Shapes.RoundedCorner(16)),
          background(colors.primaryContainer),
          padding(12, 4, 12, 4),
        ]}
      >
        {year}
      </Text>
    </Host>
  )
}
