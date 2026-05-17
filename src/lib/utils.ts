import type { Game, Player, CardValue } from "./types"

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).substring(2, 10)
}

export function createPlayer(name: string): Player {
  return { id: generateId(), name: name.trim() }
}

export function getPlayerTotal(game: Game, playerId: string): number {
  return game.rounds.reduce((sum, round) => {
    const score = round.scores.find((s) => s.playerId === playerId)
    return sum + (score?.points ?? 0)
  }, 0)
}

export function getRoundTotal(game: Game, roundNumber: number): number {
  const round = game.rounds.find((r) => r.roundNumber === roundNumber)
  if (!round) return 0
  return round.scores.reduce((sum, s) => sum + s.points, 0)
}

export function getHighestScore(game: Game): number {
  if (game.players.length === 0) return 0
  return Math.max(...game.players.map((p) => getPlayerTotal(game, p.id)))
}

export function getStandings(game: Game): { player: Player; total: number }[] {
  return game.players
    .map((p) => ({ player: p, total: getPlayerTotal(game, p.id) }))
    .sort((a, b) => a.total - b.total)
}

export function getWinner(game: Game): Player | undefined {
  const standings = getStandings(game)
  return standings[0]?.player
}

import { CARD_VALUES } from "./cardValues"

export function cardValueToPoints(value: CardValue): number {
  return CARD_VALUES[value] ?? 0
}
