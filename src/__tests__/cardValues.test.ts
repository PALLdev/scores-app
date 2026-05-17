import { describe, it, expect } from "vitest"
import { CARD_VALUES, ALL_CARDS, calculateTotal } from "@/lib/cardValues"
import type { CardValue } from "@/lib/types"

describe("CARD_VALUES", () => {
  it("has correct values for all cards", () => {
    expect(CARD_VALUES.A).toBe(20)
    expect(CARD_VALUES["2"]).toBe(2)
    expect(CARD_VALUES["10"]).toBe(10)
    expect(CARD_VALUES.J).toBe(10)
    expect(CARD_VALUES.Q).toBe(10)
    expect(CARD_VALUES.K).toBe(10)
    expect(CARD_VALUES.JOKER).toBe(30)
  })
})

describe("ALL_CARDS", () => {
  it("has 14 cards", () => {
    expect(ALL_CARDS).toHaveLength(14)
  })

  it("each card has value, label, and points", () => {
    ALL_CARDS.forEach((c) => {
      expect(c.value).toBeDefined()
      expect(c.label).toBeDefined()
      expect(c.points).toBeGreaterThan(0)
    })
  })
})

describe("calculateTotal", () => {
  it("calculates single card", () => {
    expect(calculateTotal([{ value: "A" as CardValue, count: 1 }])).toBe(20)
  })

  it("calculates multiple copies", () => {
    expect(calculateTotal([{ value: "5" as CardValue, count: 3 }])).toBe(15)
  })

  it("calculates mixed cards", () => {
    const cards = [
      { value: "A" as CardValue, count: 1 },
      { value: "K" as CardValue, count: 2 },
      { value: "JOKER" as CardValue, count: 1 },
    ]
    expect(calculateTotal(cards)).toBe(20 + 20 + 30)
  })

  it("returns 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0)
  })
})
