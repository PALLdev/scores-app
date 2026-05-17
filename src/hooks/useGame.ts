"use client"

import { useCallback } from "react"
import { useGameStore } from "@/lib/store"
import {
  getStandings,
  getWinner,
  getHighestScore,
} from "@/lib/utils"
import type { CardValue } from "@/lib/types"

export function useGame(gameId: string) {
  const game = useGameStore((s) => s.games[gameId])
  const store = useGameStore()

  const standings = game ? getStandings(game) : []
  const highestScore = game ? getHighestScore(game) : 0
  const winner = game ? getWinner(game) : undefined

  const createGame = useCallback(
    (names: string[]) => store.createGame(names),
    [store]
  )

  const addLatePlayer = useCallback(
    (name: string) => store.addLatePlayer(gameId, name),
    [store, gameId]
  )

  const submitRound = useCallback(
    (
      roundNumber: number,
      scores: {
        playerId: string
        points: number
        won: boolean
        cards?: { value: CardValue; count: number }[]
      }[]
    ) => store.submitRound(gameId, roundNumber, scores),
    [store, gameId]
  )

  const undoLastRound = useCallback(
    () => store.undoLastRound(gameId),
    [store, gameId]
  )

  const editRoundScore = useCallback(
    (
      roundNumber: number,
      playerId: string,
      points: number,
      won: boolean,
      cards?: { value: CardValue; count: number }[]
    ) => store.editRoundScore(gameId, roundNumber, playerId, points, won, cards),
    [store, gameId]
  )

  const finishGame = useCallback(
    () => store.finishGame(gameId),
    [store, gameId]
  )

  const deleteGame = useCallback(
    () => store.deleteGame(gameId),
    [store, gameId]
  )

  return {
    game,
    standings,
    highestScore,
    winner,
    createGame,
    addLatePlayer,
    submitRound,
    undoLastRound,
    editRoundScore,
    finishGame,
    deleteGame,
  }
}
