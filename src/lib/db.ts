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
  const games = getFinishedGames()
  games.push(game)
  localStorage.setItem(DB_PATH, JSON.stringify(games))
}

export function deleteFinishedGame(id: string): void {
  const games = getFinishedGames().filter((g) => g.id !== id)
  localStorage.setItem(DB_PATH, JSON.stringify(games))
}
