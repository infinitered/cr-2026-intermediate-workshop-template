import { useLocalSearchParams, Stack, router } from "expo-router"

import { WriteReviewScreen } from "@/screens/WriteReviewScreen"
import { useAppTheme } from "@/theme/context"

export default function WriteReviewRoute() {
  const { gameId, gameName, reviewId, rating, text } = useLocalSearchParams<{
    gameId: string
    gameName: string
    reviewId?: string
    rating?: string
    text?: string
  }>()
  const { theme } = useAppTheme()
  const isEditing = !!reviewId

  return (
    <>
      <Stack.Screen
        options={{
          title: isEditing ? "Edit Review" : "Write a Review",
          headerStyle: { backgroundColor: theme.colors.brandSurface },
          headerTintColor: theme.colors.brandSurfaceText,
        }}
      />
      <WriteReviewScreen
        gameId={Number(gameId)}
        gameName={gameName ?? ""}
        reviewId={reviewId}
        initialRating={rating ? Number(rating) : undefined}
        initialText={text}
        onDone={() => router.back()}
      />
    </>
  )
}
