import { LoadingScreen } from "@/components/LoadingScreen"
import { Image as ExpoImage } from "expo-image"
import { router, Stack } from "expo-router"
import {
  Host,
  List,
  Section,
  Button,
  HStack,
  VStack,
  Image,
  Text as SwiftText,
  RNHostView,
  Spacer,
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
import { useQueueService } from "@/services/queueService"
import { useState } from "react"

const SHIPMENT_SIZE = 3

export function QueueScreen() {
  const { queuedGames, availableGames, isLoading, chooseNextGame, removeFromQueue, moveInQueue } =
    useQueueService()

  const [editMode, setEditMode] = useState(false)

  const handleToggleEdit = () => {
    setEditMode((prev) => {
      return !prev
    })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Host style={{ flex: 1 }}>
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
          <List.ForEach
            onDelete={(indices) => {
              indices.forEach((index) => removeFromQueue(queuedGames[index].id))
            }}
            onMove={(sourceIndices, destination) => {
              sourceIndices.forEach((index) =>
                moveInQueue(queuedGames[index].id, destination > index ? "down" : "up"),
              )
            }}
          >
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
                <VStack>
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
                    {game.background_image ? (
                      <RNHostView matchContents>
                        <ExpoImage
                          source={game.background_image}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                          }}
                        />
                      </RNHostView>
                    ) : null}
                  </VStack>
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
