import { Pressable, useWindowDimensions, View } from "react-native"
import { Stack } from "expo-router"
import type { FeedSearchProps } from "@/components/FeedSearch"
import { TextField } from "@/components/TextField"

import { SymbolView } from "node_modules/expo-symbols/build/SymbolView"
import { ComponentRef, useRef, useState } from "react"
import { colors } from "@/theme/colors"
import { useToolbarIcons } from "@/utils/useToolbarIcons"

export function FeedSearch({ onChangeText, searchQuery }: FeedSearchProps) {
  const closeSearch = () => {
    setSearchActive(false)
    onChangeText("")
  }
  const clearSearch = () => {
    onChangeText("")
    searchInputRef.current?.focus() // clear but keep typing
  }

  const { width: windowWidth } = useWindowDimensions()
  const [searchActive, setSearchActive] = useState(false)
  const searchInputRef = useRef<ComponentRef<typeof TextField>>(null)
  const toolbarIcon = useToolbarIcons(colors.brandSurfaceText)

  return (
    <Stack.Toolbar placement="bottom">
      {searchActive ? (
        <>
          <Stack.Toolbar.View>
            <TextField
              ref={searchInputRef}
              autoFocus
              value={searchQuery}
              onChangeText={onChangeText}
              placeholder="Search games"
              returnKeyType="search"
              containerStyle={{ width: windowWidth - 96 }}
              inputWrapperStyle={{ borderRadius: 999 }} // pill
              LeftAccessory={(props) => (
                <View style={props.style}>
                  <SymbolView name="magnifyingglass" tintColor={colors.textDim} size={18} />
                </View>
              )}
              RightAccessory={
                searchQuery.length > 0
                  ? (props) => (
                      <Pressable onPress={clearSearch} style={props.style} hitSlop={8}>
                        <SymbolView name="xmark.circle.fill" tintColor={colors.textDim} size={18} />
                      </Pressable>
                    )
                  : undefined
              }
            />
          </Stack.Toolbar.View>
          <Stack.Toolbar.Spacer width={8} />
          <Stack.Toolbar.Button icon={toolbarIcon("close")} onPress={closeSearch} />
        </>
      ) : (
        <>
          <Stack.Toolbar.Spacer />
          <Stack.Toolbar.Button
            icon={toolbarIcon("search")}
            onPress={() => setSearchActive(true)}
          />
        </>
      )}
    </Stack.Toolbar>
  )
}
