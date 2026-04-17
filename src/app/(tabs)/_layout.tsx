import { ViewStyle } from "react-native"
import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

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
          backgroundColor: colors.palette.lemon500,
          borderTopColor: colors.palette.lemon600,
          paddingTop: 8,
        } satisfies ViewStyle,
        tabBarActiveTintColor: colors.palette.purple800,
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
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
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
          headerStyle: { backgroundColor: colors.palette.lemon500 },
          headerTintColor: colors.palette.purpleMuted900,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
