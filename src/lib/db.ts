import type { FinishedGameData } from "./types"

const DB_PATH = "scores-app-finished"

export function getFinishedGames(): FinishedGameData[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(DB_PATH)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveFinishedGame(game: FinishedGameData): void {
  if (typeof window === "undefined") return
  try {
    const games = getFinishedGames()
    games.push(game)
    // Keep only last 50 finished games to prevent localStorage bloat
    const trimmed = games.slice(-50)
    localStorage.setItem(DB_PATH, JSON.stringify(trimmed))
  } catch {
    // localStorage might be full or unavailable; silently fail
  }
}

export function deleteFinishedGame(id: string): void {
  const games = getFinishedGames().filter((g) => g.id !== id)
  localStorage.setItem(DB_PATH, JSON.stringify(games))
}
