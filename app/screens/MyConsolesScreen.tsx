import { SectionList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { Console } from "@/services/myConsolesService"
import { useMyConsolesService } from "@/services/myConsolesService"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function MyConsolesScreen() {
  const { themed } = useAppTheme()
  const { myConsoles, otherConsoles, isOwned, toggleOwned } = useMyConsolesService()

  const sections = [
    { title: "My Consoles", data: myConsoles, isOwnedSection: true },
    { title: "All Consoles", data: otherConsoles, isOwnedSection: false },
  ]

  return (
    <Screen preset="fixed">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={themed($sectionHeader)}>
            <Text weight="bold" size="sm">
              {section.title}
            </Text>
            {section.isOwnedSection && section.data.length === 0 && (
              <Text size="xxs" style={themed($emptyHint)}>
                Add consoles below to track your collection
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <ConsoleRow console={item} isOwned={isOwned(item.id)} onToggle={toggleOwned} />
        )}
        ItemSeparatorComponent={() => <View style={themed($separator)} />}
        contentContainerStyle={themed($listContent)}
        stickySectionHeadersEnabled={false}
      />
    </Screen>
  )
}

interface ConsoleRowProps {
  console: Console
  isOwned: boolean
  onToggle: (id: string) => void
}

function ConsoleRow({ console: item, isOwned, onToggle }: ConsoleRowProps) {
  const { themed, theme } = useAppTheme()

  return (
    <View style={themed($row)}>
      <View style={[$styles.row, $styles.flex1, $rowContent]}>
        <View style={$textColumn}>
          <Text weight="bold" size="sm">
            {item.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onToggle(item.id)} hitSlop={8}>
          <Ionicons
            name={isOwned ? "remove-circle" : "add-circle"}
            size={28}
            color={isOwned ? theme.colors.error : theme.colors.brandAccent}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingTop: spacing.lg,
  paddingBottom: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  backgroundColor: colors.background,
})

const $emptyHint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
})

const $rowContent: ViewStyle = {
  alignItems: "center",
  gap: 12,
}

const $textColumn: ViewStyle = {
  flex: 1,
}
