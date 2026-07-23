import { useMemo, useState } from "react"
import { ActivityIndicator, Alert, View, type ImageStyle, type ViewStyle } from "react-native"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useIncomingShare } from "expo-sharing"
import { Button, FieldGroup, Host, TextInput } from "@expo/ui"

import { Dropdown } from "@/components/Dropdown"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useFeedGenres } from "@/services/api/games"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export function SharedContentScreen() {
  const { themed, theme } = useAppTheme()
  const { resolvedSharedPayloads, isResolving, clearSharedPayloads } = useIncomingShare()

  // Genres already power the feed filter, so we reuse the same query here.
  const { data: genres = [] } = useFeedGenres()
  const genreItems = useMemo(
    () => genres.map((g) => ({ label: g.name, value: String(g.id) })),
    [genres],
  )

  // We only care about the first image that was shared in.
  const sharedImage = resolvedSharedPayloads.find((p) => p.contentType === "image")
  const imageUri = sharedImage?.contentUri

  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [genreId, setGenreId] = useState("")

  const canSubmit = title.trim().length > 0 && year.length === 4 && genreId.length > 0

  function dismiss() {
    clearSharedPayloads()
    router.back()
  }

  function handleAddGame() {
    // No persistence yet — just prove the flow works end to end.
    Alert.alert("Game added!", `${title.trim()} (${year}) is in your collection.`, [
      { text: "Nice", onPress: dismiss },
    ])
  }

  if (isResolving) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($center)}>
        <ActivityIndicator color={theme.colors.tint} />
        <Text style={themed($detail)}>Loading shared image…</Text>
      </Screen>
    )
  }

  if (!imageUri) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($center)}>
        <Text preset="subheading">Nothing shared yet</Text>
        <Text style={themed($detail)}>Share an image from another app to add a new game.</Text>
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($container)}>
      <View style={themed($cover)}>
        <Image source={{ uri: imageUri }} style={$coverImage} contentFit="cover" />
      </View>

      <Host style={themed($form)}>
        <FieldGroup>
          <FieldGroup.Section title="New Game">
            <TextInput
              placeholder="Game title"
              defaultValue={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Release year"
              defaultValue={year}
              onChangeText={(v) => setYear(v.replace(/[^0-9]/g, "").slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
            />
            <Dropdown
              title="Genre"
              selectedValue={genreId}
              onValueChange={setGenreId}
              items={genreItems}
            />
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Button label="Add to Collection" onPress={handleAddGame} disabled={!canSubmit} />
            <Button variant="text" label="Cancel" onPress={dismiss} />
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $form: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $cover: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 200,
  overflow: "hidden",
  backgroundColor: colors.border,
})

const $coverImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $center: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
})

const $detail: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
  textAlign: "center",
})
