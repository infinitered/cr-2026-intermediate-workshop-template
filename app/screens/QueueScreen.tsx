import {
  FlatList,
  Image,
  ImageStyle,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { Game } from "@/services/api/types"
import { useQueueService } from "@/services/queueService"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function QueueScreen() {
  const { themed, theme } = useAppTheme()
  const { queuedGames, availableGames, isLoading, chooseNextGame, removeFromQueue, moveInQueue } =
    useQueueService()
  const { bottom } = useSafeAreaInsets()

  if (isLoading) {
    return <LoadingScreen />
  }

  const isEmpty = queuedGames.length === 0

  return (
    <ScrollView  style={[themed($bottomButton), { paddingBottom: bottom + 16 }]} contentInsetAdjustmentBehavior="automatic">
      <View style={$styles.flex1}>
        {!isEmpty && (
          <View style={themed($header)}>
            <Text size="xs" style={themed($headerText)}>
              {queuedGames.length} {queuedGames.length === 1 ? "game" : "games"} in your queue
            </Text>
          </View>
        )}

        {isEmpty ? (
          <View style={$emptyContainer}>
            <Text style={themed($emptyText)}>
              {"There are no games in your queue yet, why don't you add one?"}
            </Text>
          </View>
        ) : (
          <FlatList<Game>
            data={queuedGames}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <QueueRow
                game={item}
                position={index + 1}
                isFirst={index === 0}
                isLast={index === queuedGames.length - 1}
              />
            )}
            contentContainerStyle={themed($listContent)}
            ItemSeparatorComponent={() => <View style={themed($separator)} />}
          />
        )}
      </View>

      <View style={themed($bottomButton)}>
        <Button
          text={availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
          preset="reversed"
          style={themed($chooseButton)}
          onPress={chooseNextGame}
          disabled={availableGames.length === 0}
        />
      </View>
    </View>
  )
}

interface QueueRowProps {
  game: Game
  position: number
  isFirst: boolean
  isLast: boolean
}

function QueueRow({ game, position, isFirst, isLast }: QueueRowProps) {
  const { themed, theme } = useAppTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={themed($row)}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      <View style={[$styles.row, $styles.flex1, $rowContent]}>
        <Text weight="bold" size="sm" style={themed($positionText)}>
          {position}
        </Text>

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

        <View style={$controls}>
          <TouchableOpacity
            onPress={() => moveInQueue(game.id, "up")}
            disabled={isFirst}
            hitSlop={8}
          >
            <Ionicons
              name="chevron-up"
              size={20}
              color={isFirst ? theme.colors.border : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => moveInQueue(game.id, "down")}
            disabled={isLast}
            hitSlop={8}
          >
            <Ionicons
              name="chevron-down"
              size={20}
              color={isLast ? theme.colors.border : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFromQueue(game.id)} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
})

const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
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
  paddingVertical: spacing.sm,
})

const $rowContent: ViewStyle = {
  alignItems: "center",
  gap: 12,
}

const $positionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccent,
  width: 24,
  textAlign: "center",
})

const $textColumn: ViewStyle = {
  flex: 1,
}

const $thumbnail: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 48,
  height: 48,
  borderRadius: spacing.xs,
})

const $thumbnailPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.border,
})

const $dimText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $controls: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 32,
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $bottomButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $chooseButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandAccent,
  borderRadius: spacing.xs,
})
