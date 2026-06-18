import { ViewStyle } from "react-native"
import { Host, HorizontalMultiBrowseCarousel, RNHostView } from "@expo/ui/jetpack-compose"

import { GameCarouselCard } from "./GameCarouselCard"
import type { Game } from "../services/api/types"

interface GameGalleryProps {
  games: Game[]
}

const CAROUSEL_HEIGHT = 220
// Preferred width of the focused item; the carousel sizes peeking items around it.
const PREFERRED_ITEM_WIDTH = 220

/**
 * Android gallery backed by Material 3's `HorizontalMultiBrowseCarousel`, giving native masking
 * and morph animations as the user swipes. Each game is an RN `GameCarouselCard` hosted inside
 * the Compose tree via `RNHostView`.
 */
export function GameGallery({ games }: GameGalleryProps) {
  return (
    <Host style={$host}>
      <HorizontalMultiBrowseCarousel
        preferredItemWidth={PREFERRED_ITEM_WIDTH}
        itemSpacing={8}
        contentPadding={{ start: 16, end: 16 }}
      >
        {games.map((game) => (
          <RNHostView key={game.id}>
            <GameCarouselCard game={game} />
          </RNHostView>
        ))}
      </HorizontalMultiBrowseCarousel>
    </Host>
  )
}

const $host: ViewStyle = {
  height: CAROUSEL_HEIGHT,
}
