import { createStore } from "./store"

jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))

describe("createStore", () => {
  it("returns initial state from getSnapshot", () => {
    const store = createStore({ count: 0 })
    expect(store.getSnapshot()).toEqual({ count: 0 })
  })

  it("updates state with partial object", () => {
    const store = createStore({ a: 1, b: 2 })
    store.setState({ a: 10 })
    expect(store.getSnapshot()).toEqual({ a: 10, b: 2 })
  })

  it("updates state with function", () => {
    const store = createStore({ count: 0 })
    store.setState((prev) => ({ count: prev.count + 1 }))
    expect(store.getSnapshot()).toEqual({ count: 1 })
  })

  it("notifies subscribers on state change", () => {
    const store = createStore({ count: 0 })
    const listener = jest.fn()
    store.subscribe(listener)
    store.setState({ count: 1 })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("does not notify when state is unchanged (bail-out)", () => {
    const store = createStore({ count: 0 })
    const listener = jest.fn()
    store.subscribe(listener)
    store.setState({ count: 0 })
    expect(listener).not.toHaveBeenCalled()
  })

  it("unsubscribes correctly", () => {
    const store = createStore({ count: 0 })
    const listener = jest.fn()
    const unsub = store.subscribe(listener)
    unsub()
    store.setState({ count: 1 })
    expect(listener).not.toHaveBeenCalled()
  })

  it("calls save on setState when persistKey is provided", () => {
    const { save } = require("@/utils/storage")
    const store = createStore({ count: 0 }, "test-key")
    store.setState({ count: 5 })
    expect(save).toHaveBeenCalledWith("test-key", { count: 5 })
  })

  it("hydrates from load when persistKey is provided", () => {
    const { load } = require("@/utils/storage")
    load.mockReturnValueOnce({ count: 42 })
    const store = createStore({ count: 0 }, "test-key")
    expect(store.getSnapshot()).toEqual({ count: 42 })
  })

  it("uses initial state when load returns null", () => {
    const store = createStore({ count: 0 }, "test-key")
    expect(store.getSnapshot()).toEqual({ count: 0 })
  })
})
