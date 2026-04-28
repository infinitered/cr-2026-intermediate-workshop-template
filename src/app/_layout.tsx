import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import { Stack, SplashScreen } from "expo-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

import { initI18n } from "@/i18n"
import { queryClient } from "@/services/api/queryClient"
import { ThemeProvider } from "@/theme/context"
import { customFontsToLoad } from "@/theme/typography"
import { loadDateFnsLocale } from "@/utils/formatDate"

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("@/devtools/ReactotronConfig")

  // Enable MSW mocking of api responses
  //
  // To use actual API responses, make sure to set the
  // EXPO_PUBLIC_RAWG_API_KEY var and comment out these lines
  // require("@/services/mocks/msw.polyfills")
  // const { server } = require("@/services/mocks/server")
  // server.listen()
}

export default function Root() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="game/[id]"
                options={{ headerShown: true, title: "Game Detail" }}
              />
              <Stack.Screen name="genre/[id]" options={{ headerShown: true, title: "Genre" }} />
              <Stack.Screen
                name="review/[gameId]"
                options={{ headerShown: true, presentation: "modal" }}
              />
              <Stack.Screen name="disclosures" />
            </Stack>
          </QueryClientProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
