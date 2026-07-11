import { useEffect, useState } from "react"
import { Platform, type ImageSourcePropType } from "react-native"
import {
  unstable_getMaterialSymbolSourceAsync,
  type AndroidSymbol,
  type SFSymbol,
} from "expo-symbols"

/**
 * Toolbar icons for the games feed, paired per platform: an iOS SF Symbol and the
 * equivalent Android Material Symbol.
 *
 * On Android, `Stack.Toolbar` Menu/Button/MenuAction drop SF Symbol names and only
 * render an `ImageSourcePropType`. This hook rasterizes the Material Symbols into
 * image sources (via `expo-symbols`) so a single toolbar definition renders natively
 * on both platforms — SF Symbols on iOS, Material Symbols on Android.
 */
const TOOLBAR_ICONS = {
  filter: { sf: "line.3.horizontal.decrease", material: "filter_list" },
  gallery: { sf: "square.grid.2x2", material: "grid_view" },
  list: { sf: "list.bullet", material: "view_list" },
  allItems: { sf: "rectangle.grid.3x3", material: "apps" },
  removeFilter: { sf: "minus.circle", material: "filter_list_off" },
  search: { sf: "magnifyingglass", material: "search" },
  close: { sf: "xmark", material: "close" },
} satisfies Record<string, { sf: SFSymbol; material: AndroidSymbol }>

export type ToolbarIconKey = keyof typeof TOOLBAR_ICONS

/**
 * Returns a resolver for toolbar icons. On iOS it yields the SF Symbol name; on
 * Android it yields a rasterized Material Symbol image source — or `undefined` until
 * the async sources finish loading (labeled menu rows still render in the meantime).
 *
 * @param color color to bake into the Android image sources (e.g. the header tint)
 * @param size pixel size of the generated Android icons
 */
export function useToolbarIcons(color: string, size = 24) {
  const [sources, setSources] = useState<Partial<Record<ToolbarIconKey, ImageSourcePropType>>>({})

  useEffect(() => {
    if (Platform.OS !== "android") return

    let cancelled = false
    const keys = Object.keys(TOOLBAR_ICONS) as ToolbarIconKey[]
    Promise.all(
      keys.map((key) =>
        unstable_getMaterialSymbolSourceAsync(TOOLBAR_ICONS[key].material, size, color).then(
          (source) => [key, source] as const,
        ),
      ),
    ).then((entries) => {
      if (!cancelled) {
        setSources(Object.fromEntries(entries.filter(([, source]) => source != null)))
      }
    })

    return () => {
      cancelled = true
    }
  }, [color, size])

  return (key: ToolbarIconKey): SFSymbol | ImageSourcePropType | undefined =>
    Platform.OS === "android" ? sources[key] : TOOLBAR_ICONS[key].sf
}
