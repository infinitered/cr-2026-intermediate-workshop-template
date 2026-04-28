import { useState } from "react"
import { TouchableOpacity, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { addReview, updateReview } from "@/stores/reviews"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface WriteReviewScreenProps {
  gameId: number
  gameName: string
  reviewId?: string
  initialRating?: number
  initialText?: string
  onDone: () => void
}

export function WriteReviewScreen({
  gameId,
  gameName,
  reviewId,
  initialRating,
  initialText,
  onDone,
}: WriteReviewScreenProps) {
  const { themed } = useAppTheme()
  const [rating, setRating] = useState(initialRating ?? 0)
  const [text, setText] = useState(initialText ?? "")
  const isEditing = !!reviewId

  const canSubmit = rating > 0 && text.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    if (isEditing) {
      updateReview(gameId, reviewId, text.trim(), rating)
    } else {
      addReview(gameId, text.trim(), rating)
    }
    onDone()
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <Text weight="bold" size="lg">
        {gameName}
      </Text>

      <View style={themed($section)}>
        <Text weight="bold" size="xs">
          Rating
        </Text>
        <View style={$starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Text size="xxl" style={star <= rating ? themed($starFilled) : themed($starEmpty)}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={themed($section)}>
        <TextField
          label="Your Review"
          placeholder="What did you think of this game?"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
          containerStyle={themed($textFieldContainer)}
        />
      </View>

      <Button
        text={isEditing ? "Update Review" : "Submit Review"}
        preset="filled"
        onPress={handleSubmit}
        disabled={!canSubmit}
        style={themed($submitButton)}
      />
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  gap: spacing.md,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $starRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $starFilled: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brandAccent,
})

const $starEmpty: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.border,
})

const $textFieldContainer: ThemedStyle<ViewStyle> = () => ({})

const $submitButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  borderRadius: spacing.xs,
})
