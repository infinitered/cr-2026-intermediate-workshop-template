# Chain React 2026 — Intermediate Workshop Template

A retro 80s games catalog app built with Expo SDK 55, React Native 0.83, and React 19. Workshop attendees start with this standard React Native app and progressively convert components to native platform UI using Expo's native component APIs.

## Prerequisites

- Node.js 18+
- pnpm
- Expo CLI (`npx expo`)
- iOS Simulator (Xcode) and/or Android Emulator

## Setup

```bash
pnpm install
```

### RAWG API Key

The app uses the [RAWG Video Games Database API](https://rawg.io/apidocs). Get a free API key at rawg.io and add it to your environment:

```bash
cp .env.local.example .env.local
# Add your RAWG_API_KEY to .env.local
```

### Offline Mode (MSW)

The app ships with fabricated mock data and MSW handlers for fully offline operation — no API key needed. MSW is enabled by default via three lines in `src/app/_layout.tsx`. To switch to the live API, comment those lines out.

Mock fixtures live in `app/services/mocks/fixtures/` (9 years of games, 90 detail pages, 90 screenshot sets).

## Running

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

This is a dev client app (uses native modules like MMKV), so `npx expo start` alone won't work — you need a development build.

## Architecture

### Navigation

Expo Router file-based routing in `src/app/`:

- `(tabs)/index.tsx` — Games feed (year-grouped carousels)
- `(tabs)/genres.tsx` — Genre list with "In Feed" badges
- `(tabs)/settings.tsx` — Settings (display name, theme, content prefs)
- `game/[id].tsx` — Game detail (screenshots, favorites, reviews)
- `genre/[slug].tsx` — Genre detail with game list
- `review.tsx` — Write/edit review modal
- `shared.tsx` — Incoming share handler (via expo-sharing)
- `disclosures.tsx` — About/legal

### State Management

Custom store built on `useSyncExternalStore` (`app/utils/store.ts`) with MMKV persistence:

- `app/stores/favorites.ts` — Favorited game IDs
- `app/stores/genreFilter.ts` — Selected genre filters
- `app/stores/reviews.ts` — User reviews
- `app/stores/settings.ts` — Display name, sort order, content prefs

### Data Layer

- **react-query** for API data fetching and caching
- **MSW 2.x** (`msw/native`) for offline mocking with `require.context` dynamic fixture loading
- API service in `app/services/api/` (RAWG endpoints, TypeScript types)

### Theming

Ignite-derived theme system with dark/light mode, design tokens, and branded color palette. Theme context in `app/theme/`.

## Workshop Goals

Attendees convert standard React Native components to native platform equivalents:

- **Tabs** → Native tabs (`expo-router/unstable-native-tabs`)
- **Toggle/Switch/TextField/Slider** → Expo UI native components
- **Tab bar icons** → SF Symbols / Material Symbols
- **Header buttons** → Native toolbar buttons
- **Modal** → Form sheet presentation
- **Alert** → Context menus
- **List** → SwiftUI List / LazyColumn

## Tests

```bash
pnpm test
```

40 tests across 8 suites covering store mechanics, favorites, reviews, genre filters, and settings.

## License

MIT
