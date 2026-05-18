import { useState } from "react"
import { FlatList, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useMutedKeywords, addMutedKeyword, removeMutedKeyword } from "@/stores/mutedKeywords"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export function MutedKeywordsScreen() {
  const { themed, theme } = useAppTheme()
  const { keywords } = useMutedKeywords()
  const [text, setText] = useState("")

  function handleAdd() {
    if (!text.trim()) return
    addMutedKeyword(text)
    setText("")
  }

  return (
    <Screen preset="fixed">
      <View style={themed($inputRow)}>
        <TextInput
          style={themed($input)}
          value={text}
          onChangeText={setText}
          placeholder="Add a keyword to mute..."
          placeholderTextColor={theme.colors.textDim}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={handleAdd} style={themed($addButton)}>
          <Ionicons name="add" size={24} color={theme.colors.brandAccentText} />
        </TouchableOpacity>
      </View>

      {keywords.length === 0 ? (
        <View style={themed($emptySection)}>
          <Text size="xs" style={themed($emptyText)}>
            Games matching muted keywords will be excluded from "Choose My Next Game".
          </Text>
        </View>
      ) : (
        <FlatList
          data={keywords}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={themed($row)}>
              <Text size="sm" style={{ flex: 1 }}>
                {item}
              </Text>
              <TouchableOpacity onPress={() => removeMutedKeyword(item)} hitSlop={8}>
                <Ionicons name="close-circle" size={22} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={themed($separator)} />}
          contentContainerStyle={themed($listContent)}
        />
      )}
    </Screen>
  )
}

const $inputRow: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  gap: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $input: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  flex: 1,
  height: 40,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: spacing.xs,
  paddingHorizontal: spacing.sm,
  color: colors.text,
  fontFamily: "spaceGrotesk-regular",
  fontSize: 14,
})

const $addButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: spacing.xs,
  backgroundColor: colors.brandAccent,
  alignItems: "center",
  justifyContent: "center",
})

const $emptySection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  gap: spacing.xs,
})
