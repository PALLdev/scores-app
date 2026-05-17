import { describe, it, expect } from "vitest"
import { ROUND_COMBINATIONS, getRoundCombination } from "@/lib/combinations"

describe("ROUND_COMBINATIONS", () => {
  it("has 10 rounds", () => {
    expect(ROUND_COMBINATIONS).toHaveLength(10)
  })

  it("each round has required fields", () => {
    ROUND_COMBINATIONS.forEach((r) => {
      expect(r.roundNumber).toBeGreaterThan(0)
      expect(r.name).toBeTruthy()
      expect(r.description).toBeTruthy()
      expect(r.cards).toBeGreaterThan(0)
    })
  })

  it("rounds are in sequential order", () => {
    ROUND_COMBINATIONS.forEach((r, i) => {
      expect(r.roundNumber).toBe(i + 1)
    })
  })

  it("last round is Escala real", () => {
    const last = ROUND_COMBINATIONS[9]
    expect(last.name).toBe("Escala real")
    expect(last.cards).toBe(13)
  })

  it("round 9 is Escala sucia", () => {
    const r9 = ROUND_COMBINATIONS[8]
    expect(r9.name).toBe("Escala sucia")
  })
})

describe("getRoundCombination", () => {
  it("returns correct combo for round 1", () => {
    expect(getRoundCombination(1)?.name).toBe("2 tríos")
  })

  it("returns undefined for invalid round", () => {
    expect(getRoundCombination(99)).toBeUndefined()
  })
})
