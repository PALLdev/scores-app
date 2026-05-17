"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Game, Player, RoundScore, CardCount, CardValue } from "./types"
import { generateId, createPlayer } from "./utils"
import { MAX_PLAYERS, MAX_ROUNDS } from "./constants"

interface GameStore {
  games: Record<string, Game>
  currentGameId: string | null

  createGame: (names: string[]) => string
  addLatePlayer: (gameId: string, name: string) => void
  submitRound: (
    gameId: string,
    roundNumber: number,
    scores: {
      playerId: string
      points: number
      won: boolean
      cards?: { value: CardValue; count: number }[]
    }[]
  ) => void
  undoLastRound: (gameId: string) => void
  editRoundScore: (
    gameId: string,
    roundNumber: number,
    playerId: string,
    points: number,
    won: boolean,
    cards?: { value: CardValue; count: number }[]
  ) => void
  finishGame: (gameId: string) => void
  deleteGame: (gameId: string) => void
  getGame: (gameId: string) => Game | undefined
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      games: {},
      currentGameId: null,

      createGame: (names: string[]) => {
        const id = generateId()
        const trimmed = names.map((n) => n.trim()).filter((n) => n.length > 0)
        if (trimmed.length < 2 || new Set(trimmed).size !== trimmed.length) return ""
        const players = trimmed.map((n) => createPlayer(n))
        const game: Game = {
          id,
          players,
          rounds: [],
          status: "in_progress",
          currentRound: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((s) => ({ games: { ...s.games, [id]: game }, currentGameId: id }))
        return id
      },

      addLatePlayer: (gameId: string, name: string) => {
        const game = get().games[gameId]
        if (!game || game.players.length >= MAX_PLAYERS) return

        const clean = name.trim()
        if (!clean || clean.length > 30) return
        if (game.players.some((p) => p.name.toLowerCase() === clean.toLowerCase())) return

        const player = createPlayer(clean)
        const maxScore = Math.max(
          0,
          ...game.players.map((p) =>
            game.rounds.reduce((sum, r) => {
              const sc = r.scores.find((s) => s.playerId === p.id)
              return sum + (sc?.points ?? 0)
            }, 0)
          )
        )

        const numRounds = game.rounds.length
        const existingRounds = game.rounds.map((r, i) => {
          const perRound = numRounds > 0 ? Math.floor(maxScore / numRounds) : 0
          const remainder = numRounds > 0 ? maxScore % numRounds : 0
          const pts = i === numRounds - 1 ? perRound + remainder : perRound
          return {
            ...r,
            scores: [...r.scores, { playerId: player.id, points: pts, won: false }],
          }
        })

        set((s) => ({
          games: {
            ...s.games,
            [gameId]: {
              ...game,
              players: [...game.players, player],
              rounds: existingRounds,
              updatedAt: Date.now(),
            },
          },
        }))
      },

      submitRound: (gameId, roundNumber, scores) => {
        const game = get().games[gameId]
        if (!game) return

        const winners = scores.filter((s) => s.won)
        if (winners.length !== 1) return

        for (const s of scores) {
          if (s.points < 0 || s.points > 500) return
        }

        const roundScores: RoundScore[] = scores.map((s) => ({
          playerId: s.playerId,
          points: s.points,
          won: s.won,
          cards: s.cards?.map((c) => ({ value: c.value, count: c.count })),
        }))

        const newRound = { roundNumber, scores: roundScores }
        const existing = game.rounds.filter((r) => r.roundNumber !== roundNumber)
        const newRounds = [...existing, newRound].sort((a, b) => a.roundNumber - b.roundNumber)

        const isLastRound = roundNumber >= MAX_ROUNDS
        set((s) => ({
          games: {
            ...s.games,
            [gameId]: {
              ...game,
              rounds: newRounds,
              currentRound: isLastRound ? MAX_ROUNDS : roundNumber + 1,
              status: isLastRound ? "completed" : "in_progress",
              updatedAt: Date.now(),
            },
          },
        }))
      },

      undoLastRound: (gameId: string) => {
        const game = get().games[gameId]
        if (!game || game.rounds.length === 0) return

        const maxRound = Math.max(...game.rounds.map((r) => r.roundNumber))
        set((s) => ({
          games: {
            ...s.games,
            [gameId]: {
              ...game,
              rounds: game.rounds.filter((r) => r.roundNumber !== maxRound),
              currentRound: maxRound,
              status: "in_progress",
              updatedAt: Date.now(),
            },
          },
        }))
      },

      editRoundScore: (gameId, roundNumber, playerId, points, won, cards) => {
        const game = get().games[gameId]
        if (!game) return

        if (points < 0 || points > 500) return

        const round = game.rounds.find((r) => r.roundNumber === roundNumber)
        if (!round) return

        const updatedScores = round.scores.map((sc) =>
          sc.playerId === playerId
            ? { ...sc, points, won, cards: cards?.map((c) => ({ value: c.value, count: c.count })) }
            : sc
        )
        const winners = updatedScores.filter((s) => s.won)
        if (winners.length !== 1) return

        set((s) => ({
          games: {
            ...s.games,
            [gameId]: {
              ...game,
              rounds: game.rounds.map((r) =>
                r.roundNumber === roundNumber
                  ? { ...r, scores: updatedScores }
                  : r
              ),
              updatedAt: Date.now(),
            },
          },
        }))
      },

      finishGame: (gameId: string) => {
        const game = get().games[gameId]
        if (!game) return
        set((s) => ({
          games: {
            ...s.games,
            [gameId]: { ...game, status: "completed", updatedAt: Date.now() },
          },
        }))
      },

      deleteGame: (gameId: string) => {
        set((s) => {
          const { [gameId]: _, ...rest } = s.games
          return {
            games: rest,
            currentGameId: s.currentGameId === gameId ? null : s.currentGameId,
          }
        })
      },

      getGame: (gameId: string) => {
        return get().games[gameId]
      },
    }),
    { name: "scores-app-games" }
  )
)
