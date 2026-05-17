"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { CardSelector } from "./CardSelector"
import { ManualInput } from "./ManualInput"
import { Button } from "@/components/ui/Button"
import type { Player, CardCount } from "@/lib/types"
import { calculateTotal } from "@/lib/cardValues"

interface RoundInputProps {
  roundNumber: number
  players: Player[]
  currentScores: Record<string, { points: number; won: boolean; cards?: CardCount[] }>
  onScoreChange: (playerId: string, points: number, won: boolean, cards?: CardCount[]) => void
  onSubmit: () => void
}

export function RoundInput({
  roundNumber,
  players,
  currentScores,
  onScoreChange,
  onSubmit,
}: RoundInputProps) {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0)
  const [localPoints, setLocalPoints] = useState<number>(0)
  const previousRoundRef = useRef(roundNumber)

  // Reset player index and points when round changes
  useEffect(() => {
    if (previousRoundRef.current !== roundNumber) {
      setSelectedPlayerIndex(0)
      setLocalPoints(0)
      previousRoundRef.current = roundNumber
    }
  }, [roundNumber])

  // Reset player index if it goes out of bounds
  useEffect(() => {
    if (selectedPlayerIndex >= players.length) {
      setSelectedPlayerIndex(0)
    }
  }, [players.length, selectedPlayerIndex])

  const currentPlayer = players[selectedPlayerIndex]
  const currentScore = currentPlayer ? currentScores[currentPlayer.id] : undefined
  const isWon = currentScore?.won ?? false

  useEffect(() => {
    const score = currentPlayer ? currentScores[currentPlayer.id] : undefined
    setLocalPoints(score?.points ?? 0)
  }, [selectedPlayerIndex, currentPlayer, currentScores])

  const handleWonToggle = () => {
    if (!currentPlayer) return
    const newWon = !isWon
    onScoreChange(currentPlayer.id, newWon ? 0 : localPoints, newWon, newWon ? [] : currentScore?.cards)
  }

  const handleCardsChange = useCallback(
    (cards: CardCount[]) => {
      if (!currentPlayer) return
      const pts = calculateTotal(cards)
      setLocalPoints(pts)
      onScoreChange(currentPlayer.id, pts, false, cards)
    },
    [currentPlayer, onScoreChange]
  )

  const handleManualChange = (value: number) => {
    if (!currentPlayer) return
    setLocalPoints(value)
    onScoreChange(currentPlayer.id, value, false, [])
  }

  const allEntered = players.every((p) => currentScores[p.id] !== undefined)
  const anyEntered = Object.keys(currentScores).length > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Player tabs - scrollable on small screens */}
      <div className="flex gap-1.5 flex-wrap overflow-x-auto pb-1 -mx-1 px-1">
        {players.map((p, i) => {
          const entered = currentScores[p.id] !== undefined
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlayerIndex(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0
                ${i === selectedPlayerIndex
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : entered
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }
              `}
            >
              {p.name} {entered ? "✓" : ""}
            </button>
          )
        })}
      </div>

      {currentPlayer && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {currentPlayer.name}
            </h3>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Ganó la ronda</span>
              <input
                type="checkbox"
                checked={isWon}
                onChange={handleWonToggle}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400
                  dark:border-neutral-600 dark:bg-neutral-800 dark:checked:bg-white dark:checked:border-white"
              />
            </label>
          </div>

          {isWon ? (
            <div className="py-6 text-center">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">0 pts</span>
              <p className="text-sm text-neutral-400 mt-1">Ganó la ronda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-wide">
                  Selector visual
                </p>
                <CardSelector
                  key={`${roundNumber}-${currentPlayer.id}`}
                  onCardsChange={handleCardsChange}
                  initialCards={currentScore?.cards}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-wide">
                  Manual
                </p>
                <ManualInput value={localPoints} onChange={handleManualChange} />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {selectedPlayerIndex < players.length - 1 && (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setSelectedPlayerIndex((i) => Math.min(i + 1, players.length - 1))}
          >
            Siguiente jugador
          </Button>
        )}
        <Button
          className={`${selectedPlayerIndex < players.length - 1 ? "sm:flex-1" : "w-full"}`}
          onClick={onSubmit}
          disabled={!allEntered}
        >
          {roundNumber >= 10 ? "Finalizar juego" : "Confirmar ronda"}
        </Button>
      </div>
    </div>
  )
}
