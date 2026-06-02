jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))

let toggleGenre: typeof import("./genreFilter").toggleGenre
let clearGenres: typeof import("./genreFilter").clearGenres
let isSelected: (id: number) => boolean

beforeEach(() => {
  jest.resetModules()
  jest.mock("@/utils/storage", () => ({ load: jest.fn(() => null), save: jest.fn() }))
  const mod = require("./genreFilter")
  toggleGenre = mod.toggleGenre
  clearGenres = mod.clearGenres
  // isSelected is only exposed via the hook; read store snapshot instead
  const { save } = require("@/utils/storage")
  isSelected = (id: number) => {
    const lastCall = save.mock.calls[save.mock.calls.length - 1]
    if (!lastCall) return false // no genres selected by default ("All Items")
    return (lastCall[1] as { selectedIds: number[] }).selectedIds.includes(id)
  }
})

describe("genreFilter store", () => {
  it("starts with no genres selected (All Items)", () => {
    expect(isSelected(4)).toBe(false)
    expect(isSelected(83)).toBe(false)
    expect(isSelected(5)).toBe(false)
  })

  it("toggles a genre on", () => {
    toggleGenre(7)
    expect(isSelected(7)).toBe(true)
  })

  it("toggles a genre off", () => {
    toggleGenre(4) // turn on
    expect(isSelected(4)).toBe(true)
    toggleGenre(4) // turn off
    expect(isSelected(4)).toBe(false)
  })

  it("toggles the same genre on then off", () => {
    toggleGenre(99)
    toggleGenre(99)
    expect(isSelected(99)).toBe(false)
  })

  it("clears all genres", () => {
    clearGenres()
    expect(isSelected(4)).toBe(false)
    expect(isSelected(83)).toBe(false)
    expect(isSelected(5)).toBe(false)
  })
})
