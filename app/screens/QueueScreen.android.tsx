import { Image as ExpoImage } from "expo-image"
import { router } from "expo-router"
import ArrowDownward from "@expo/material-symbols/arrow_downward.xml"
import ArrowUpward from "@expo/material-symbols/arrow_upward.xml"
import Cancel from "@expo/material-symbols/cancel.xml"
import {
  Host,
  LazyColumn,
  ElevatedCard,
  Button,
  Row,
  HorizontalDivider,
  Icon,
  IconButton,
  Text as ComposeText,
  RNHostView,
  useMaterialColors,
} from "@expo/ui/jetpack-compose"
import { clickable, fillMaxWidth, padding, size, weight } from "@expo/ui/jetpack-compose/modifiers"

import { useQueueService } from "@/services/queueService"
import { LoadingScreen } from "@/components/LoadingScreen"
import type { Game } from "@/services/api/types"
import { colors } from "@/theme/colors"

export function QueueScreen() {
  const { queuedGames, availableGames, isLoading, chooseNextGame } = useQueueService()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Host style={{ flex: 1 }} seedColor={colors.brandSurface}>
      <LazyColumn contentPadding={{ start: 16, end: 16, bottom: 24 }}>
        {queuedGames.map((game, index) => (
          <QueueCard key={game.id} game={game} index={index} total={queuedGames.length} />
        ))}

        <HorizontalDivider modifiers={[padding(0, 16, 0, 8)]} />

        <Button onClick={chooseNextGame} modifiers={[fillMaxWidth()]}>
          <ComposeText>
            {availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
          </ComposeText>
        </Button>
      </LazyColumn>
    </Host>
  )
}

function QueueCard({ game, index, total }: { game: Game; index: number; total: number }) {
  const isFirst = index === 0
  const isLast = index === total - 1
  const { removeFromQueue, moveInQueue } = useQueueService()
  const materialColors = useMaterialColors()

  return (
    <ElevatedCard
      modifiers={[padding(0, 4, 0, 4), clickable(() => router.push(`/game/${game.id}`))]}
    >
      <Row
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 12 }}
        modifiers={[fillMaxWidth(), padding(16, 12, 16, 12)]}
      >
        <ComposeText style={{ typography: "titleSmall" }}>{String(index + 1)}</ComposeText>
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
        <ComposeText style={{ typography: "bodyMedium" }} modifiers={[weight(1)]}>
          {game.name}
        </ComposeText>
        <IconButton
          onClick={() => moveInQueue(game.id, "up")}
          enabled={!isFirst}
          modifiers={[size(28, 28)]}
        >
          <Icon source={ArrowUpward} size={20} />
        </IconButton>
        <IconButton
          onClick={() => moveInQueue(game.id, "down")}
          enabled={!isLast}
          modifiers={[size(28, 28)]}
        >
          <Icon source={ArrowDownward} size={20} />
        </IconButton>
        <IconButton onClick={() => removeFromQueue(game.id)} modifiers={[size(28, 28)]}>
          <Icon source={Cancel} size={20} tint={materialColors.error} />
        </IconButton>
      </Row>
    </ElevatedCard>
  )
}
