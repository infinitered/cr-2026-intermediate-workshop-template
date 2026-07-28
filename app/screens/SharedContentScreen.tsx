import { useMemo, useState } from "react"
import { ActivityIndicator, Alert, View, type ImageStyle, type ViewStyle } from "react-native"
import { Image } from "expo-image"
import { router, Stack } from "expo-router"
import { useIncomingShare } from "expo-sharing"
import { Button, Column, FieldGroup, Host, Text, TextInput } from "@expo/ui"

import { Dropdown } from "@/components/Dropdown"
import { Screen } from "@/components/Screen"
import { useFeedGenres } from "@/services/api/games"
import { colors } from "@/theme/colorsDark"
import { spacing } from "@/theme/spacing"
import { useToolbarIcons } from "@/utils/useToolbarIcons"

export function SharedContentScreen() {
  const { resolvedSharedPayloads, isResolving, clearSharedPayloads } = useIncomingShare()

  const { data: genres = [] } = useFeedGenres()
  const genreItems = useMemo(
    () => genres.map((g) => ({ label: g.name, value: String(g.id) })),
    [genres],
  )

  const sharedImage = resolvedSharedPayloads.find((p) => p.contentType === "image")
  const imageUri = sharedImage?.contentUri

  const [title, setTitle] = useState("")
  const [year, setYear] = useState("")
  const [genreId, setGenreId] = useState("")

  const canSubmit = title.trim().length > 0 && year.length === 4 && genreId.length > 0

  const toolbarIcon = useToolbarIcons(colors.brandSurfaceText)

  function dismiss() {
    clearSharedPayloads()
    router.back()
  }

  function handleAddGame() {
    // No persistence yet, just prove the flow works end to end.
    Alert.alert("Game added!", `${title.trim()} (${year}) is in your collection.`, [
      { onPress: () => dismiss() },
    ])
  }

  if (isResolving) {
    return (
      <Screen preset="fixed" contentContainerStyle={$center}>
        <ActivityIndicator color={colors.tint} />
        <Host matchContents>
          <Text textStyle={{ color: colors.textDim, textAlign: "center" }}>
            Loading shared image...
          </Text>
        </Host>
      </Screen>
    )
  }

  if (!imageUri) {
    return (
      <Screen preset="fixed" contentContainerStyle={$center}>
        <Host matchContents>
          <Column spacing={spacing.xs} alignment="center">
            <Text textStyle={{ fontSize: 20, fontWeight: "600" }}>Nothing shared yet</Text>
            <Text textStyle={{ color: colors.textDim, textAlign: "center" }}>
              Share an image from another app to add a new game.
            </Text>
          </Column>
        </Host>
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$container}>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={toolbarIcon("close")}
          accessibilityLabel="Close"
          onPress={dismiss}
        />
      </Stack.Toolbar>
      <View style={$cover}>
        <Image source={{ uri: imageUri }} style={$coverImage} contentFit="cover" />
      </View>

      <Host style={$form}>
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

          <Host matchContents>
            <Button label="Add to Collection" onPress={handleAddGame} disabled={!canSubmit} />
          </Host>
        </FieldGroup>
      </Host>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $form: ViewStyle = {
  flex: 1,
}

const $cover: ViewStyle = {
  height: 200,
  overflow: "hidden",
  backgroundColor: colors.border,
}

const $coverImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $center: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
  gap: spacing.xs,
}
