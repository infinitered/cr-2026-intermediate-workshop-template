const BASE_URL = "https://api.rawg.io/api"
const API_KEY = process.env.EXPO_PUBLIC_RAWG_API_KEY

export async function rawgFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set("key", API_KEY ?? "")
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`)
  return res.json()
}
