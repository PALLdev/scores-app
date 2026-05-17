export type GameStatus = "in_progress" | "completed"

export interface Player {
  id: string
  name: string
}

export interface RoundScore {
  playerId: string
  points: number
  won: boolean
  cards?: CardCount[]
}

export interface CardCount {
  value: CardValue
  count: number
}

export interface Round {
  roundNumber: number
  scores: RoundScore[]
}

export interface Game {
  id: string
  players: Player[]
  rounds: Round[]
  status: GameStatus
  currentRound: number
  createdAt: number
  updatedAt: number
}

export type CardValue =
  | "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
  | "J" | "Q" | "K" | "JOKER"

export interface CardInfo {
  value: CardValue
  label: string
  points: number
}

export interface RoundCombination {
  roundNumber: number
  name: string
  description: string
  cards: number
}

export interface FinishedGameData {
  id: string
  createdAt: string
  players: {
    name: string
    rounds: { round: number; points: number }[]
    total: number
  }[]
  winner: string
}
