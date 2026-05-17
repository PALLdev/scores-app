import { describe, it, expect } from "vitest"
import {
  createPlayer,
  getPlayerTotal,
  getHighestScore,
  getStandings,
  getWinner,
  cardValueToPoints,
} from "@/lib/utils"
import type { Game } from "@/lib/types"

function makeGame(overrides?: Partial<Game>): Game {
  return {
    id: "test-1",
    players: [
      { id: "p1", name: "Ana" },
      { id: "p2", name: "Luis" },
    ],
    rounds: [
      {
        roundNumber: 1,
        scores: [
          { playerId: "p1", points: 10, won: false },
          { playerId: "p2", points: 0, won: true },
        ],
      },
      {
        roundNumber: 2,
        scores: [
          { playerId: "p1", points: 5, won: false },
          { playerId: "p2", points: 20, won: false },
        ],
      },
    ],
    status: "in_progress",
    currentRound: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

describe("createPlayer", () => {
  it("creates a player with id and trimmed name", () => {
    const p = createPlayer("  Carlos  ")
    expect(p.name).toBe("Carlos")
    expect(p.id).toBeDefined()
  })
})

describe("getPlayerTotal", () => {
  it("sums all round scores for a player", () => {
    const game = makeGame()
    expect(getPlayerTotal(game, "p1")).toBe(15)
    expect(getPlayerTotal(game, "p2")).toBe(20)
  })

  it("returns 0 for player with no rounds", () => {
    const game = makeGame()
    expect(getPlayerTotal(game, "p3")).toBe(0)
  })
})

describe("getHighestScore", () => {
  it("returns highest total among players", () => {
    const game = makeGame()
    expect(getHighestScore(game)).toBe(20)
  })

  it("returns 0 for empty players", () => {
    const game = makeGame({ players: [] })
    expect(getHighestScore(game)).toBe(0)
  })
})

describe("getStandings", () => {
  it("sorts players by total ascending", () => {
    const game = makeGame()
    const standings = getStandings(game)
    expect(standings[0].player.name).toBe("Ana")
    expect(standings[0].total).toBe(15)
    expect(standings[1].total).toBe(20)
  })
})

describe("getWinner", () => {
  it("returns player with lowest total", () => {
    const game = makeGame()
    expect(getWinner(game)?.name).toBe("Ana")
  })
})

describe("cardValueToPoints", () => {
  const cases: [string, number][] = [
    ["A", 20], ["2", 2], ["3", 3], ["10", 10],
    ["J", 10], ["Q", 10], ["K", 10], ["JOKER", 30],
  ]
  it.each(cases)("card %s = %d points", (value, expected) => {
    expect(cardValueToPoints(value as any)).toBe(expected)
  })

  it("returns 0 for unknown card", () => {
    expect(cardValueToPoints("X" as any)).toBe(0)
  })
})
