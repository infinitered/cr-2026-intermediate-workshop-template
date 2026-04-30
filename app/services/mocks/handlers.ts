import { http, HttpResponse } from "msw"

import games1981 from "./fixtures/games-1981.json"
import games1982 from "./fixtures/games-1982.json"
import games1983 from "./fixtures/games-1983.json"
import games1984 from "./fixtures/games-1984.json"
import games1985 from "./fixtures/games-1985.json"
import games1986 from "./fixtures/games-1986.json"
import games1987 from "./fixtures/games-1987.json"
import games1988 from "./fixtures/games-1988.json"
import games1989 from "./fixtures/games-1989.json"

const BASE_URL = "https://api.rawg.io/api"

const gamesByYear: Record<string, unknown> = {
  "1981": games1981,
  "1982": games1982,
  "1983": games1983,
  "1984": games1984,
  "1985": games1985,
  "1986": games1986,
  "1987": games1987,
  "1988": games1988,
  "1989": games1989,
}

// Index of captured game detail fixtures by ID
const gameDetailFixtures: Record<string, unknown> = {}
const screenshotFixtures: Record<string, unknown> = {}

// Load all captured detail fixtures
const detailContext = require.context("./fixtures/game-details", false, /\.json$/)
for (const key of detailContext.keys()) {
  const id = key.replace("./", "").replace(".json", "")
  gameDetailFixtures[id] = detailContext(key)
}

// Load all captured screenshot fixtures
const ssContext = require.context("./fixtures/game-screenshots", false, /\.json$/)
for (const key of ssContext.keys()) {
  const id = key.replace("./", "").replace(".json", "")
  screenshotFixtures[id] = ssContext(key)
}

const emptyPage = { count: 0, next: null, previous: null, results: [] }

// Build a fallback detail from the list-level game data
function buildFallbackDetail(gameId: string) {
  for (const fixture of Object.values(gamesByYear) as Array<{
    results: Array<Record<string, unknown>>
  }>) {
    const game = fixture.results.find((g) => String(g.id) === gameId)
    if (game) {
      return {
        ...game,
        description: "",
        description_raw: "",
        name_original: game.name,
        background_image_additional: null,
        website: "",
        developers: [],
        publishers: [],
        screenshots_count: 0,
        movies_count: 0,
        creators_count: 0,
        achievements_count: 0,
        parent_achievements_count: "0",
        reddit_url: "",
        reddit_name: "",
        reddit_description: "",
        reddit_logo: "",
        reddit_count: 0,
        twitch_count: "0",
        youtube_count: "0",
        alternative_names: [],
        metacritic_url: "",
        metacritic_platforms: [],
        parents_count: 0,
        additions_count: 0,
        game_series_count: 0,
      }
    }
  }
  return null
}

export const handlers = [
  // GET /games — match on dates param to return year-specific fixture
  http.get(`${BASE_URL}/games`, ({ request }) => {
    const url = new URL(request.url)
    const dates = url.searchParams.get("dates")
    if (dates) {
      const year = dates.split("-")[0]
      const fixture = gamesByYear[year]
      if (fixture) return HttpResponse.json(fixture)
    }
    return HttpResponse.json(emptyPage)
  }),

  http.get(`${BASE_URL}/games/:id/screenshots`, ({ params }) => {
    const id = String(params.id)
    return HttpResponse.json(screenshotFixtures[id] ?? emptyPage)
  }),

  http.get(`${BASE_URL}/games/:id/movies`, () => {
    return HttpResponse.json(emptyPage)
  }),

  http.get(`${BASE_URL}/games/:id/game-series`, () => {
    return HttpResponse.json(emptyPage)
  }),

  // Game detail — must come after sub-resource routes
  http.get(`${BASE_URL}/games/:id`, ({ params }) => {
    const id = String(params.id)
    const captured = gameDetailFixtures[id]
    if (captured) return HttpResponse.json(captured)

    const fallback = buildFallbackDetail(id)
    if (fallback) return HttpResponse.json(fallback)

    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${BASE_URL}/genres`, () => {
    return HttpResponse.json(emptyPage)
  }),

  http.get(`${BASE_URL}/tags`, () => {
    return HttpResponse.json(emptyPage)
  }),
]
