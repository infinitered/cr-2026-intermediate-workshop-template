import { Color, Stack } from "expo-router"
import { Platform } from "react-native"

export type FeedSearchProps = {
  searchQuery: string
  onChangeText: (text: string) => void
}

export function FeedSearch({ searchQuery, onChangeText }: FeedSearchProps) {
  return (
    <>
      <Stack.SearchBar
        placeholder="Search games..."
        onChangeText={(e) => onChangeText(e.nativeEvent.text)}
        {...(Platform.OS === "android" && {
          barTintColor: Color.android.dynamic.surfaceContainerHigh,
          textColor: Color.android.dynamic.onSurface,
          hintTextColor: Color.android.dynamic.onSurfaceVariant,
          headerIconColor: Color.android.dynamic.onSurfaceVariant,
          tintColor: Color.android.dynamic.primary,
        })}
      />
    </>
  )
}
