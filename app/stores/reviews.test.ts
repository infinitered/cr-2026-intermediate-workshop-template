jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))

let addReview: typeof import("./reviews").addReview
let updateReview: typeof import("./reviews").updateReview
let deleteReview: typeof import("./reviews").deleteReview

beforeEach(() => {
  jest.resetModules()
  jest.mock("@/utils/storage", () => ({ load: jest.fn(() => null), save: jest.fn() }))
  const mod = require("./reviews")
  addReview = mod.addReview
  updateReview = mod.updateReview
  deleteReview = mod.deleteReview
})

function getPersistedReviews(gameId: number) {
  const { save } = require("@/utils/storage")
  const lastCall = save.mock.calls[save.mock.calls.length - 1]
  if (!lastCall) return []
  const state = lastCall[1] as { byGameId: Record<string, any[]> }
  return state.byGameId[String(gameId)] ?? []
}

describe("reviews store", () => {
  it("adds a review", () => {
    addReview(1, "Great game", 5)
    const reviews = getPersistedReviews(1)
    expect(reviews).toHaveLength(1)
    expect(reviews[0]).toMatchObject({ text: "Great game", rating: 5 })
  })

  it("adds reviews in newest-first order", () => {
    addReview(1, "First", 3)
    addReview(1, "Second", 4)
    const reviews = getPersistedReviews(1)
    expect(reviews).toHaveLength(2)
    expect(reviews[0]).toMatchObject({ text: "Second" })
    expect(reviews[1]).toMatchObject({ text: "First" })
  })

  it("keeps reviews separate per game", () => {
    addReview(1, "Review for game 1", 5)
    addReview(2, "Review for game 2", 3)
    const { save } = require("@/utils/storage")
    const state = save.mock.calls.at(-1)[1]
    expect(Object.keys(state.byGameId)).toHaveLength(2)
  })

  it("updates a review", () => {
    addReview(1, "Original", 3)
    const id = getPersistedReviews(1)[0].id
    updateReview(1, id, "Updated", 5)
    const reviews = getPersistedReviews(1)
    expect(reviews).toHaveLength(1)
    expect(reviews[0]).toMatchObject({ text: "Updated", rating: 5 })
  })

  it("deletes a review", () => {
    addReview(1, "To keep", 4)
    addReview(1, "To delete", 2)
    const id = getPersistedReviews(1).find((r: any) => r.text === "To delete").id
    deleteReview(1, id)
    const reviews = getPersistedReviews(1)
    expect(reviews).toHaveLength(1)
    expect(reviews[0]).toMatchObject({ text: "To keep" })
  })
})
