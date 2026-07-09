import { useMemo, useState } from "react"
import { Image, ImageStyle, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Stack, router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export default function SearchScreen() {
  const { themed } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("")
  const { data: yearGroups } = useGamesByYear()

  const allGames = useMemo(() => {
    if (!yearGroups) return []
    return yearGroups.flatMap((group) => group.games)
  }, [yearGroups])

  const filteredGames = useMemo(() => {
    if (!searchText.trim()) return allGames
    const query = searchText.toLowerCase()
    return allGames.filter((game) => game.name.toLowerCase().includes(query))
  }, [allGames, searchText])

  return (
    <>
      <Stack.SearchBar
        placeholder="Search games..."
        onChangeText={(e) => setSearchText(e.nativeEvent.text)}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <SearchRow key={game.id} game={game} themed={themed} />
          ))
        ) : (
          <View style={$emptyContainer}>
            <Text style={themed($emptyText)}>
              {searchText ? "No games found" : "Search for a game"}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  )
}

function SearchRow({ game, themed }: { game: Game; themed: ReturnType<typeof useAppTheme>["themed"] }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={themed($row)}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={themed($thumbnail)} />
      ) : (
        <View style={[themed($thumbnail), themed($thumbnailPlaceholder)]} />
      )}
      <View style={$textColumn}>
        <Text weight="bold" size="sm" numberOfLines={1}>
          {game.name}
        </Text>
        <Text size="xxs" style={themed($dimText)} numberOfLines={1}>
          {game.genres?.map((g) => g.name).join(", ")}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  gap: 12,
})

const $thumbnail: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 48,
  height: 48,
  borderRadius: spacing.xs,
})

const $thumbnailPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.border,
})

const $textColumn: ViewStyle = {
  flex: 1,
}

const $dimText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 64,
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
