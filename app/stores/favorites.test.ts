jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))

let toggleFavorite: typeof import("./favorites").toggleFavorite
let clearFavorites: typeof import("./favorites").clearFavorites
let isFavorite: typeof import("./favorites").isFavorite

beforeEach(() => {
  jest.resetModules()
  jest.mock("@/utils/storage", () => ({ load: jest.fn(() => null), save: jest.fn() }))
  const mod = require("./favorites")
  toggleFavorite = mod.toggleFavorite
  clearFavorites = mod.clearFavorites
  isFavorite = mod.isFavorite
})

describe("favorites store", () => {
  it("starts with no favorites", () => {
    expect(isFavorite(1)).toBe(false)
  })

  it("toggles a favorite on", () => {
    toggleFavorite(1)
    expect(isFavorite(1)).toBe(true)
  })

  it("toggles a favorite off", () => {
    toggleFavorite(1)
    toggleFavorite(1)
    expect(isFavorite(1)).toBe(false)
  })

  it("tracks multiple favorites independently", () => {
    toggleFavorite(1)
    toggleFavorite(2)
    expect(isFavorite(1)).toBe(true)
    expect(isFavorite(2)).toBe(true)
    expect(isFavorite(3)).toBe(false)
  })

  it("clears all favorites", () => {
    toggleFavorite(1)
    toggleFavorite(2)
    clearFavorites()
    expect(isFavorite(1)).toBe(false)
    expect(isFavorite(2)).toBe(false)
  })
})
