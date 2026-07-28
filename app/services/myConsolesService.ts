import { useMyConsoles } from "@/stores/myConsoles"

export interface Console {
  id: string
  name: string
}

const ALL_CONSOLES: Console[] = [
  { id: "nes", name: "Nintendo Entertainment System (NES)" },
  { id: "snes", name: "Super Nintendo (SNES)" },
  { id: "n64", name: "Nintendo 64" },
  { id: "game-boy", name: "Game Boy" },
  { id: "game-boy-advance", name: "Game Boy Advance" },
  { id: "genesis", name: "Sega Genesis" },
  { id: "sega-master-system", name: "Sega Master System" },
  { id: "game-gear", name: "Sega Game Gear" },
  { id: "turbografx-16", name: "TurboGrafx-16" },
  { id: "atari-2600", name: "Atari 2600" },
  { id: "neo-geo", name: "Neo Geo" },
  { id: "sega-cd", name: "Sega CD" },
  { id: "colecovision", name: "ColecoVision" },
  { id: "intellivision", name: "Intellivision" },
  { id: "wonderswan", name: "WonderSwan" },
]

export function useMyConsolesService() {
  const { ids: ownedIds, addConsole, removeConsole, isOwned } = useMyConsoles()

  const myConsoles = ownedIds
    .map((id) => ALL_CONSOLES.find((c) => c.id === id))
    .filter(Boolean) as Console[]

  const otherConsoles = ALL_CONSOLES.filter((c) => !ownedIds.includes(c.id))

  function toggleOwned(id: string) {
    if (isOwned(id)) {
      removeConsole(id)
    } else {
      addConsole(id)
    }
  }

  return {
    myConsoles,
    otherConsoles,
    isOwned,
    toggleOwned,
  }
}
