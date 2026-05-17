import type { CardInfo, CardValue } from "./types"

export const CARD_VALUES: Record<CardValue, number> = {
  A: 20,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  JOKER: 30,
}

export const ALL_CARDS: CardInfo[] = [
  { value: "A", label: "A", points: 20 },
  { value: "2", label: "2", points: 2 },
  { value: "3", label: "3", points: 3 },
  { value: "4", label: "4", points: 4 },
  { value: "5", label: "5", points: 5 },
  { value: "6", label: "6", points: 6 },
  { value: "7", label: "7", points: 7 },
  { value: "8", label: "8", points: 8 },
  { value: "9", label: "9", points: 9 },
  { value: "10", label: "10", points: 10 },
  { value: "J", label: "J", points: 10 },
  { value: "Q", label: "Q", points: 10 },
  { value: "K", label: "K", points: 10 },
  { value: "JOKER", label: "🃏", points: 30 },
]

export const CARD_MAP = new Map(ALL_CARDS.map((c) => [c.value, c]))

export function calculateTotal(cards: { value: CardValue; count: number }[]): number {
  return cards.reduce((sum, c) => sum + CARD_VALUES[c.value] * c.count, 0)
}
