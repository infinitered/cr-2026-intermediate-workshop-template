import { ViewStyle } from "react-native"
import { Tabs } from "expo-router"

import { useAppTheme } from "@/theme/context"
import { typeScale } from "@/theme/typography"

export default function TabsLayout() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.palette.purpleMuted900,
          borderTopColor: colors.palette.purpleMuted800,
        } satisfies ViewStyle,
        tabBarActiveTintColor: colors.palette.lemon500,
        tabBarInactiveTintColor: colors.palette.purpleMuted500,
        tabBarLabelStyle: {
          fontFamily: typeScale.label2.fontFamily,
          fontSize: typeScale.label2.fontSize,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Games",
          headerShown: true,
          headerStyle: { backgroundColor: colors.palette.lemon500 },
          headerTintColor: colors.palette.purpleMuted900,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
          tabBarIcon: ({ color: _color }) => null,
        }}
      />
      <Tabs.Screen
        name="genres"
        options={{
          title: "Genres",
          headerShown: true,
          headerStyle: { backgroundColor: colors.palette.lemon500 },
          headerTintColor: colors.palette.purpleMuted900,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
          tabBarIcon: ({ color: _color }) => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color: _color }) => null,
        }}
      />
    </Tabs>
  )
}
