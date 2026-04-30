export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  console.log("[native-intent] path:", path, "initial:", initial)

  try {
    const url = new URL(path)
    if (url.hostname === "expo-sharing") {
      return "/shared"
    }
    return path
  } catch {
    return path
  }
}
