import { useState } from "react"
import { ActivityIndicator, Pressable, ViewStyle } from "react-native"
import { Image as ExpoImage } from "expo-image"
import { router, Stack } from "expo-router"
import {
  Host,
  List,
  Section,
  Button,
  Label,
  Image,
  Text as SwiftText,
  RNHostView,
} from "@expo/ui/swift-ui"
import {
  environment,
  tag,
  badge,
  onTapGesture,
  contentShape,
  shapes,
} from "@expo/ui/swift-ui/modifiers"

import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
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
  const [selectedIds, setSelectedIds] = useState<number[]>([])

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

  const handleBulkDelete = () => {
    for (const id of selectedIds) {
      removeFromQueue(id)
    }
    setSelectedIds([])
  }

  const handleToggleEdit = () => {
    setEditMode((prev) => {
      if (prev) setSelectedIds([])
      return !prev
    })
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
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleToggleEdit} hitSlop={8} style={{ marginRight: 4 }}>
              <Text style={{ color: theme.colors.brandAccent }} size="sm">
                {editMode ? "Done" : "Edit"}
              </Text>
            </Pressable>
          ),
        }}
      />
      <Host style={$host}>
        <List
          selection={editMode ? selectedIds : undefined}
          onSelectionChange={(sel) => setSelectedIds(sel.map(Number))}
          modifiers={[environment("editMode", editMode ? "active" : "inactive")]}
        >
          <Section
            header={
              <SwiftText>The first {SHIPMENT_SIZE} games will be in your next delivery!</SwiftText>
            }
          >
            <List.ForEach onDelete={handleDelete} onMove={handleMove}>
              {queuedGames.map((game, index) => (
                <Label
                  key={game.id}
                  title={`${index + 1}. ${game.name}`}
                  icon={
                    game.background_image ? (
                      <RNHostView matchContents>
                        <ExpoImage source={game.background_image} style={$thumbnail} />
                      </RNHostView>
                    ) : (
                      <Image systemName="gamecontroller.fill" size={20} color={theme.colors.tint} />
                    )
                  }
                  modifiers={[
                    tag(game.id),
                    // note: these modifiers break the image - maybe it's better to use an HStack
                    //...(index < SHIPMENT_SIZE ? [badge("Next")] : []),
                    contentShape(shapes.rectangle()),
                    onTapGesture(() => {
                      if (!editMode) router.push(`/game/${game.id}`)
                    }),
                  ]}
                />
              ))}
            </List.ForEach>
          </Section>
          {editMode && selectedIds.length > 0 ? (
            <Button
              label={`Delete ${selectedIds.length} Game${selectedIds.length > 1 ? "s" : ""}`}
              role="destructive"
              onPress={handleBulkDelete}
            />
          ) : null}
          {!editMode ? (
            <Section>
              <Button
                label={availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
                onPress={() => chooseNextGame(availableGames)}
              />
            </Section>
          ) : null}
        </List>
      </Host>
    </>
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

const $thumbnail = {
  width: 40,
  height: 40,
  borderRadius: 6,
}
