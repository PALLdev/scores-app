"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogActions } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { CardSelector } from "./CardSelector"
import { ManualInput } from "./ManualInput"
import { getRoundCombination } from "@/lib/combinations"
import type { Player, CardCount, CardValue } from "@/lib/types"
import { calculateTotal } from "@/lib/cardValues"

interface EditScoreDialogProps {
  open: boolean
  onClose: () => void
  onSave: (points: number, won: boolean, cards?: CardCount[]) => void
  player: Player
  roundNumber: number
  currentPoints: number
  currentWon: boolean
  currentCards?: CardCount[]
}

export function EditScoreDialog({
  open,
  onClose,
  onSave,
  player,
  roundNumber,
  currentPoints,
  currentWon,
  currentCards,
}: EditScoreDialogProps) {
  const [isWon, setIsWon] = useState(currentWon)
  const [cards, setCards] = useState<CardCount[]>(currentCards ?? [])
  const [manualPoints, setManualPoints] = useState(currentPoints)

  const combo = getRoundCombination(roundNumber)

  useEffect(() => {
    setIsWon(currentWon)
    setCards(currentCards ?? [])
    setManualPoints(currentPoints)
  }, [currentWon, currentCards, currentPoints, open])

  const handleCardsChange = (newCards: CardCount[]) => {
    setCards(newCards)
    const total = calculateTotal(newCards)
    setManualPoints(total)
  }

  const handleSave = () => {
    if (isWon) {
      onSave(0, true, [])
    } else {
      onSave(manualPoints, false, cards.length > 0 ? cards : undefined)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Editar puntaje - ${player.name}`}>
      {combo && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Ronda {roundNumber}: {combo.name}
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isWon}
            onChange={() => setIsWon(!isWon)}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900
              dark:border-neutral-600 dark:bg-neutral-800"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Ganó la ronda</span>
        </label>
      </div>

      {isWon ? (
        <div className="py-4 text-center">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">0 pts</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-2 uppercase">Selector visual</p>
            <CardSelector onCardsChange={handleCardsChange} initialCards={currentCards} />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-2 uppercase">Manual</p>
            <ManualInput value={manualPoints} onChange={setManualPoints} />
          </div>
        </div>
      )}

      <DialogActions>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  )
}
