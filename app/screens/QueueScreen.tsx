import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useGamesByYear } from "@/services/api/games"
import type { Game } from "@/services/api/types"
import { useFavoriteGenres } from "@/stores/favoriteGenres"
import { useMutedKeywords } from "@/stores/mutedKeywords"
import { useQueue, addToQueue, removeFromQueue, moveInQueue } from "@/stores/queue"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export function QueueScreen() {
  const { themed, theme } = useAppTheme()
  const { ids } = useQueue()
  const { ids: favoriteGenreIds } = useFavoriteGenres()
  const { keywords: mutedKeywords } = useMutedKeywords()
  const { data: yearGroups = [], isLoading } = useGamesByYear()

  // Build a lookup of all games by ID
  const gamesById = new Map<number, Game>()
  for (const group of yearGroups) {
    for (const game of group.games) {
      gamesById.set(game.id, game)
    }
  }

  const queuedGames = ids.map((id) => gamesById.get(id)).filter(Boolean) as Game[]

  // All games not already in the queue
  const availableGames: Game[] = []
  for (const group of yearGroups) {
    for (const game of group.games) {
      if (!ids.includes(game.id)) {
        availableGames.push(game)
      }
    }
  }

  function chooseNextGame() {
    if (availableGames.length === 0) return
    // Filter out games matching muted keywords
    const unmuted =
      mutedKeywords.length > 0
        ? availableGames.filter(
            (g) => !mutedKeywords.some((kw) => g.name.toLowerCase().includes(kw)),
          )
        : availableGames
    const candidates = unmuted.length > 0 ? unmuted : availableGames
    // Prefer games matching favorite genres when available
    const preferred =
      favoriteGenreIds.length > 0
        ? candidates.filter((g) =>
            g.genres.some((genre) => favoriteGenreIds.includes(genre.id)),
          )
        : []
    const pool = preferred.length > 0 ? preferred : candidates
    const pick = pool[Math.floor(Math.random() * pool.length)]
    addToQueue(pick.id)
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
    <Screen preset="fixed">
      <View style={themed($header)}>
        <Text size="xs" style={themed($headerText)}>
          {queuedGames.length} {queuedGames.length === 1 ? "game" : "games"} in your queue
        </Text>
      </View>

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
        ListFooterComponent={
          <View style={themed($footerSection)}>
            <Button
              text={availableGames.length > 0 ? "Choose My Next Game" : "All Games Queued!"}
              preset="reversed"
              style={themed($chooseButton)}
              onPress={chooseNextGame}
              disabled={availableGames.length === 0}
            />
            <Text size="xxs" weight="bold" style={themed($footerHeader)}>
              Customize what games we'll choose next
            </Text>
            <TouchableOpacity
              style={$footerLink}
              onPress={() => router.push("/favorite-genres")}
            >
              <Ionicons name="heart-outline" size={16} color={theme.colors.brandAccent} />
              <Text size="xs" style={{ color: theme.colors.brandAccent }}>
                Set Favorite Genres
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={$footerLink}
              onPress={() => router.push("/muted-keywords")}
            >
              <Ionicons name="volume-mute-outline" size={16} color={theme.colors.brandAccent} />
              <Text size="xs" style={{ color: theme.colors.brandAccent }}>
                Muted Keywords
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </Screen>
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

const $centered: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
})

const $headerText: ThemedStyle<ViewStyle> = ({ colors }) => ({
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

const $footerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
})

const $chooseButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brandAccent,
  borderRadius: spacing.xs,
})

const $footerHeader: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.lg,
  textTransform: "uppercase",
  letterSpacing: 1,
})

const $footerLink: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  marginTop: 12,
}
