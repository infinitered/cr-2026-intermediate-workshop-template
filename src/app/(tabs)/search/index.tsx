import { useMemo, useState } from "react"
import { Image, View } from "react-native"
import { Stack, useRouter } from "expo-router"
import {
  Button,
  ContentUnavailableView,
  Host,
  HStack,
  List,
  RNHostView,
  Text,
  VStack,
} from "@expo/ui/swift-ui"
import { buttonStyle, font, foregroundStyle, listStyle } from "@expo/ui/swift-ui/modifiers"

import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"

export default function SearchScreen() {
  const router = useRouter()
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
      <Host style={{ flex: 1 }}>
        {filteredGames.length > 0 ? (
          <List modifiers={[listStyle("plain")]}>
            {filteredGames.map((game) => (
              <Button
                key={game.id}
                onPress={() => router.push(`/game/${game.id}`)}
                modifiers={[buttonStyle("plain")]}
              >
                <SearchRow game={game} />
              </Button>
            ))}
          </List>
        ) : (
          <ContentUnavailableView
            title={searchText ? "No Results" : "Search for a game"}
            systemImage={searchText ? "magnifyingglass" : "gamecontroller"}
            description={
              searchText ? `No games match "${searchText}"` : "Type to search for games"
            }
          />
        )}
      </Host>
    </>
  )
}

function SearchRow({ game }: { game: Game }) {
  return (
    <HStack spacing={12} alignment="center">
      <RNHostView matchContents>
        {game.background_image ? (
          <Image
            source={{ uri: game.background_image }}
            style={{ width: 48, height: 48, borderRadius: 6 }}
          />
        ) : (
          <View style={{ width: 48, height: 48, borderRadius: 6, backgroundColor: "#ccc" }} />
        )}
      </RNHostView>
      <VStack alignment="leading" spacing={2}>
        <Text modifiers={[font({ size: 15, weight: "semibold" })]}>{game.name}</Text>
        <Text
          modifiers={[
            font({ size: 12 }),
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {game.genres?.map((g) => g.name).join(", ") ?? ""}
        </Text>
      </VStack>
    </HStack>
  )
}
