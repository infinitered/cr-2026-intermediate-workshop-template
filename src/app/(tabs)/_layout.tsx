import { ViewStyle } from "react-native"
import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "@/theme/context"
import { typeScale } from "@/theme/typography"

export default function TabsLayout() {
  const {
    theme: { colors },
  } = useAppTheme()

  const barBg = colors.brandSurface
  const barTint = colors.brandSurfaceText
  const barBorder = colors.border

  const headerStyle = {
    backgroundColor: barBg,
    borderBottomWidth: 2,
    borderBottomColor: barBorder,
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: barBg,
          borderTopColor: barBorder,
          borderTopWidth: 2,
          paddingTop: 8,
        } satisfies ViewStyle,
        tabBarActiveTintColor: colors.brandAccent,
        tabBarInactiveTintColor: colors.trackInactive,
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
          headerStyle,
          headerTintColor: barTint,
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
          headerStyle,
          headerTintColor: barTint,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
          headerStyle,
          headerTintColor: barTint,
          headerTitleStyle: { fontFamily: typeScale.headline1.fontFamily },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
