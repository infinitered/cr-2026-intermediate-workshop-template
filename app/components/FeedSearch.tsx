export type FeedSearchProps = {
  /** Called live as the query changes. */
  onChangeText: (text: string) => void
}

// On iOS the search lives in the bottom Stack.Toolbar, so this base variant renders nothing.
export function FeedSearch(_props: FeedSearchProps) {
  return null
}
