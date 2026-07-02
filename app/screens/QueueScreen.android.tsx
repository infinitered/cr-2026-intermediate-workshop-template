import { ViewStyle } from "react-native"
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
} from "@expo/ui/jetpack-compose"
import { clickable, fillMaxWidth, padding, size, weight } from "@expo/ui/jetpack-compose/modifiers"

import { EmptyState } from "@/components/EmptyState"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
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
    <Host
      style={{ flex: 1 }}
      colorScheme={isDarkMode ? "dark" : "light"}
      seedColor={theme.colors.brandSurface}
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
            <ExpoImage source={game.background_image} style={$thumbnail} />
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
          <Icon source={Cancel} size={20} tint="#D32F2F" />
        </IconButton>
      </Row>
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

const $thumbnail = {
  width: 40,
  height: 40,
  borderRadius: 6,
}
