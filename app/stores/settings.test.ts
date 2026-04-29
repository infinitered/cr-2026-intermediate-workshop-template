jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))

let getSettings: () => Record<string, unknown>
let setState: (partial: Record<string, unknown>) => void

beforeEach(() => {
  jest.resetModules()
  jest.mock("@/utils/storage", () => ({ load: jest.fn(() => null), save: jest.fn() }))
  // settings only exposes setters via the hook; access the store directly
  const storeMod = require("@/utils/store")
  const originalCreateStore = storeMod.createStore
  let capturedStore: ReturnType<typeof originalCreateStore>
  storeMod.createStore = (...args: Parameters<typeof originalCreateStore>) => {
    capturedStore = originalCreateStore(...args)
    return capturedStore
  }
  require("./settings")
  getSettings = () => capturedStore.getSnapshot()
  setState = (partial) => capturedStore.setState(partial)
  // restore
  storeMod.createStore = originalCreateStore
})

describe("settings store", () => {
  it("starts with defaults", () => {
    expect(getSettings()).toEqual({
      displayName: "",
      hideMature: false,
      minRating: 3,
      sortOrder: "Rating",
    })
  })

  it("updates displayName", () => {
    setState({ displayName: "Retro Gamer" })
    expect(getSettings()).toMatchObject({ displayName: "Retro Gamer" })
  })

  it("updates hideMature", () => {
    setState({ hideMature: true })
    expect(getSettings()).toMatchObject({ hideMature: true })
  })

  it("updates minRating", () => {
    setState({ minRating: 5 })
    expect(getSettings()).toMatchObject({ minRating: 5 })
  })

  it("updates sortOrder", () => {
    setState({ sortOrder: "Name" })
    expect(getSettings()).toMatchObject({ sortOrder: "Name" })
  })

  it("preserves other fields on partial update", () => {
    setState({ displayName: "Player One" })
    setState({ minRating: 1 })
    expect(getSettings()).toMatchObject({
      displayName: "Player One",
      minRating: 1,
      hideMature: false,
      sortOrder: "Rating",
    })
  })
})
