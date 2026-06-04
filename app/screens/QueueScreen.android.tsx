import { useState } from "react"
import { ActivityIndicator, Pressable, View, ViewStyle } from "react-native"
import { Image as ExpoImage } from "expo-image"
import { router } from "expo-router"
import {
  Host,
  LazyColumn,
  ElevatedCard,
  Button,
  DropdownMenu,
  DropdownMenuItem,
  HorizontalDivider,
  Text as ComposeText,
  RNHostView,
} from "@expo/ui/jetpack-compose"
import { fillMaxWidth, padding } from "@expo/ui/jetpack-compose/modifiers"
import { Ionicons } from "@expo/vector-icons"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useQueueService } from "@/services/queueService"
import { removeFromQueue, moveInQueue } from "@/stores/queue"
import { useAppTheme } from "@/theme/context"

const SHIPMENT_SIZE = 3

export function QueueScreen() {
  const { theme, themeContext } = useAppTheme()
  const { queueIds: ids, chooseNextGame } = useQueueService()
  const { data: yearGroups = [], isLoading } = useGamesByYear()
  const isDarkMode = themeContext === "dark"

  const gamesById = new Map<number, Game>()
  for (const group of yearGroups) {
    for (const game of group.games) {
      gamesById.set(game.id, game)
    }
  }

  const queuedGames = ids.map((id) => gamesById.get(id)).filter(Boolean) as Game[]

  const availableGames: Game[] = []
  for (const group of yearGroups) {
    for (const game of group.games) {
      if (!ids.includes(game.id)) {
        availableGames.push(game)
      }
    }
  }

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
      </Screen>
    )
  }

  if (queuedGames.length === 0) {
    return (
      <Screen preset="fixed" contentContainerStyle={$centered}>
        <EmptyState
          heading="Your Queue is Empty"
          content="Browse games and add them to your queue to get started."
        />
      </Screen>
    )
  }

  return (
    <Host
      style={[$host, { backgroundColor: theme.colors.background }]}
      colorScheme={isDarkMode ? "dark" : "light"}
      seedColor={theme.colors.palette.purple700}
    >
      <LazyColumn contentPadding={{ start: 16, end: 16, bottom: 24 }}>
        <ComposeText
          color={theme.colors.textDim}
          style={{ typography: "bodySmall" }}
          modifiers={[padding(0, 16, 0, 8)]}
        >
          The first {SHIPMENT_SIZE} games will be in your next delivery!
        </ComposeText>

        {queuedGames.map((game, index) => (
          <QueueCard key={game.id} game={game} index={index} total={queuedGames.length} />
        ))}

        <HorizontalDivider modifiers={[padding(0, 16, 0, 8)]} />

        <Button onClick={() => chooseNextGame(availableGames)} modifiers={[fillMaxWidth()]}>
          <ComposeText>
            {availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
          </ComposeText>
        </Button>
      </LazyColumn>
    </Host>
  )
}

function QueueCard({ game, index, total }: { game: Game; index: number; total: number }) {
  const { theme } = useAppTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ElevatedCard modifiers={[padding(0, 4, 0, 4)]}>
      <DropdownMenu expanded={menuOpen} onDismissRequest={() => setMenuOpen(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <Pressable style={$row} onPress={() => router.push(`/game/${game.id}`)}>
              <Text weight="bold" size="md" style={{ width: 24, textAlign: "center" }}>
                {String(index + 1)}
              </Text>
              {game.background_image ? (
                <ExpoImage source={game.background_image} style={$thumbnail} />
              ) : (
                <View style={$thumbnailPlaceholder} />
              )}
              <View style={$textColumn}>
                <Text weight="semiBold" size="sm" numberOfLines={1}>
                  {game.name}
                </Text>
                {game.genres && game.genres.length > 0 ? (
                  <Text size="xxs" style={{ color: theme.colors.textDim }} numberOfLines={1}>
                    {game.genres.map((g) => g.name).join(", ")}
                  </Text>
                ) : null}
              </View>
              <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
                <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textDim} />
              </Pressable>
            </Pressable>
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => router.push(`/game/${game.id}`)}>
            <DropdownMenuItem.Text>
              <ComposeText>View Details</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => moveInQueue(game.id, "up")} enabled={index > 0}>
            <DropdownMenuItem.Text>
              <ComposeText>Move Up</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => moveInQueue(game.id, "down")}
            enabled={index < total - 1}
          >
            <DropdownMenuItem.Text>
              <ComposeText>Move Down</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => removeFromQueue(game.id)}>
            <DropdownMenuItem.Text>
              <ComposeText>Remove</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </ElevatedCard>
  )
}

const $host: ViewStyle = {
  flex: 1,
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  padding: 16,
}

const $textColumn: ViewStyle = {
  flex: 1,
}

const $thumbnail = {
  width: 48,
  height: 48,
  borderRadius: 8,
}

const $thumbnailPlaceholder: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 8,
  backgroundColor: "#ccc",
}
