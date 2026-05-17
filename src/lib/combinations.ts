import type { RoundCombination } from "./types"

export const ROUND_COMBINATIONS: RoundCombination[] = [
  { roundNumber: 1, name: "2 tríos", description: "Dos tríos de 3 cartas cada uno", cards: 6 },
  { roundNumber: 2, name: "1 trío + 1 escala", description: "Un trío y una escala de 4 cartas", cards: 7 },
  { roundNumber: 3, name: "2 escalas", description: "Dos escalas de 4 cartas cada una", cards: 8 },
  { roundNumber: 4, name: "3 tríos", description: "Tres tríos de 3 cartas cada uno", cards: 9 },
  { roundNumber: 5, name: "2 tríos + 1 escala", description: "Dos tríos y una escala", cards: 10 },
  { roundNumber: 6, name: "1 trío + 2 escalas", description: "Un trío y dos escalas", cards: 11 },
  { roundNumber: 7, name: "3 escalas", description: "Tres escalas de 4 cartas cada una", cards: 12 },
  { roundNumber: 8, name: "4 tríos", description: "Cuatro tríos de 3 cartas cada uno", cards: 12 },
  { roundNumber: 9, name: "Escala sucia", description: "Escala completa A-K de cualquier pinta", cards: 13 },
  { roundNumber: 10, name: "Escala real", description: "Escala completa A-K de la misma pinta", cards: 13 },
]

export function getRoundCombination(roundNumber: number): RoundCombination | undefined {
  return ROUND_COMBINATIONS[roundNumber - 1]
}
