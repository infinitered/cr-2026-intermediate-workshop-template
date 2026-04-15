/** Paginated response envelope used by all RAWG list endpoints */
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** Platform reference nested in Game.platforms[] */
export interface PlatformRef {
  id: number
  slug: string
  name: string
}

/** Platform entry with release date and requirements */
export interface GamePlatform {
  platform: PlatformRef
  released_at: string | null
  requirements: {
    minimum?: string
    recommended?: string
  } | null
}

/** ESRB rating nested in Game */
export interface EsrbRating {
  id: number
  slug: "everyone" | "everyone-10-plus" | "teen" | "mature" | "adults-only" | "rating-pending"
  name: "Everyone" | "Everyone 10+" | "Teen" | "Mature" | "Adults Only" | "Rating Pending"
}

/** Game list item — returned by /games, /games/{id}/game-series */
export interface Game {
  id: number
  slug: string
  name: string
  released: string | null
  tba: boolean
  background_image: string | null
  rating: number
  rating_top: number
  ratings_count: number
  reviews_text_count: string
  metacritic: number | null
  playtime: number
  suggestions_count: number
  updated: string
  added: number
  added_by_status: Record<string, number>
  esrb_rating: EsrbRating | null
  platforms: GamePlatform[]
}

/** Game detail — returned by /games/{id} */
export interface GameDetail extends Game {
  name_original: string
  description: string
  description_raw: string
  background_image_additional: string | null
  website: string
  genres: { id: number; name: string; slug: string }[]
  developers: { id: number; name: string; slug: string }[]
  publishers: { id: number; name: string; slug: string }[]
  screenshots_count: number
  movies_count: number
  creators_count: number
  achievements_count: number
  parent_achievements_count: string
  reddit_url: string
  reddit_name: string
  reddit_description: string
  reddit_logo: string
  reddit_count: number
  twitch_count: string
  youtube_count: string
  alternative_names: string[]
  metacritic_url: string
  metacritic_platforms: {
    metascore: number
    url: string
  }[]
  parents_count: number
  additions_count: number
  game_series_count: number
}

/** Screenshot — returned by /games/{id}/screenshots */
export interface Screenshot {
  id: number
  image: string
  hidden: boolean
  width: number
  height: number
}

/** Movie/trailer — returned by /games/{id}/movies */
export interface Movie {
  id: number
  name: string
  preview: string
  data: Record<string, string>
}

/** Genre — returned by /genres */
export interface Genre {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
}

/** Tag — returned by /tags */
export interface Tag {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
  language: string
}
