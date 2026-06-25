export type FeedSearchProps = {
  /** Called live as the query changes. */
  onChangeText: (text: string) => void
}

/**
 * Feed search input. Only renders on Android (see `FeedSearch.android.tsx`, a
 * Material `DockedSearchBar`). On iOS the search lives in the bottom
 * `Stack.Toolbar` inside `GameFeedScreen`, so this base variant is a no-op.
 */
export function FeedSearch(_props: FeedSearchProps) {
  return null
}
