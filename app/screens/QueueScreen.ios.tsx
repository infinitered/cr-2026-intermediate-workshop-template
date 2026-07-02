import { useState } from "react"
import { ViewStyle } from "react-native"
import { Image as ExpoImage } from "expo-image"
import { router } from "expo-router"
import {
  Host,
  List,
  Section,
  Button,
  HStack,
  VStack,
  Spacer,
  Image,
  Text as SwiftText,
  RNHostView,
} from "@expo/ui/swift-ui"
import {
  environment,
  tag,
  onTapGesture,
  contentShape,
  shapes,
  badge,
  foregroundStyle,
  font,
} from "@expo/ui/swift-ui/modifiers"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useQueueService } from "@/services/queueService"
import { removeFromQueue, reorderQueue } from "@/stores/queue"
import { useAppTheme } from "@/theme/context"

export function QueueScreen() {
  const { theme } = useAppTheme()
  const { queueIds: ids, chooseNextGame } = useQueueService()
  const { data: yearGroups = [], isLoading } = useGamesByYear()
  const [editMode, setEditMode] = useState(false)

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

  const SHIPMENT_SIZE = 3

  const handleDelete = (indices: number[]) => {
    for (const index of indices) {
      const game = queuedGames[index]
      if (game) removeFromQueue(game.id)
    }
  }

  const handleMove = (sourceIndices: number[], destination: number) => {
    const fromIndex = sourceIndices[0]
    const adjustedDest = fromIndex < destination ? destination - 1 : destination
    reorderQueue(fromIndex, adjustedDest)
  }

  if (isLoading) {
    return <LoadingScreen />
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
    <Host style={$host}>
      <List modifiers={[environment("editMode", editMode ? "active" : "inactive")]}>
        <Section
          header={
            <HStack>
              <Spacer />
              <Button
                label={editMode ? "Done" : "Edit"}
                onPress={() => setEditMode((prev) => !prev)}
              />
            </HStack>
          }
          footer={
            <SwiftText>The first {SHIPMENT_SIZE} games will be in your next delivery!</SwiftText>
          }
        >
          <List.ForEach onDelete={handleDelete} onMove={handleMove}>
            {queuedGames.map((game, index) => (
              <HStack
                key={game.id}
                spacing={12}
                alignment="center"
                modifiers={[
                  tag(game.id),
                  ...(index < SHIPMENT_SIZE ? [badge("Next")] : []),
                  onTapGesture(() => {
                    if (!editMode) router.push(`/game/${game.id}`)
                  }),
                ]}
              >
                <SwiftText
                  modifiers={[
                    foregroundStyle({ type: "hierarchical", style: "secondary" }),
                    font({ weight: "bold", size: 12 }),
                  ]}
                >
                  {String(index + 1)}
                </SwiftText>
                {game.background_image ? (
                  <RNHostView matchContents>
                    <ExpoImage source={game.background_image} style={$thumbnail} />
                  </RNHostView>
                ) : (
                  <Image systemName="gamecontroller.fill" size={20} color={theme.colors.tint} />
                )}
                <VStack alignment="leading" spacing={2}>
                  <SwiftText modifiers={[font({ weight: "semibold" })]}>{game.name}</SwiftText>
                  {game.genres && game.genres.length > 0 ? (
                    <SwiftText
                      modifiers={[
                        font({ size: 12 }),
                        foregroundStyle({ type: "hierarchical", style: "secondary" }),
                      ]}
                    >
                      {game.genres.map((g) => g.name).join(", ")}
                    </SwiftText>
                  ) : null}
                </VStack>
              </HStack>
            ))}
          </List.ForEach>
        </Section>
        {!editMode ? (
          <Section>
            <Button
              label={availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
              onPress={chooseNextGame}
            />
          </Section>
        ) : null}
      </List>
    </Host>
  )
}

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $host: ViewStyle = {
  flex: 1,
}

const $thumbnail = {
  width: 40,
  height: 40,
  borderRadius: 6,
}
