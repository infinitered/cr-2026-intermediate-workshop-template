import { ViewStyle } from "react-native"
import { Host, HorizontalMultiBrowseCarousel, RNHostView } from "@expo/ui/jetpack-compose"

import { GameCarouselCard } from "./GameCarouselCard"
import type { Game } from "../services/api/types"

const CAROUSEL_HEIGHT = 220
const PREFERRED_ITEM_WIDTH = 220 // focused item; the carousel sizes peeking items around it

export function GameGallery({ games }: { games: Game[] }) {
  return (
    <Host style={{ height: CAROUSEL_HEIGHT } satisfies ViewStyle}>
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
