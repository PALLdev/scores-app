"use client"

import { useState, useCallback } from "react"
import { ALL_CARDS, CARD_MAP } from "@/lib/cardValues"
import type { CardValue, CardCount } from "@/lib/types"

function toCards(selected: Record<string, number>): CardCount[] {
  return Object.entries(selected)
    .filter(([, count]) => count > 0)
    .map(([v, count]) => ({ value: v as CardValue, count }))
}

interface CardSelectorProps {
  onCardsChange: (cards: CardCount[]) => void
  initialCards?: CardCount[]
}

export function CardSelector({ onCardsChange, initialCards }: CardSelectorProps) {
  const [selected, setSelected] = useState<Record<string, number>>(() => {
    if (initialCards) {
      const map: Record<string, number> = {}
      initialCards.forEach((c) => { map[c.value] = c.count })
      return map
    }
    return {}
  })

  const toggleCard = useCallback(
    (value: CardValue) => {
      const next = { ...selected }
      const current = next[value] ?? 0
      if (current >= 4) {
        delete next[value]
      } else {
        next[value] = current + 1
      }
      setSelected(next)
      onCardsChange(toCards(next))
    },
    [selected, onCardsChange]
  )

  const removeCard = useCallback(
    (value: CardValue) => {
      const current = selected[value] ?? 0
      let next: Record<string, number>
      if (current <= 1) {
        const { [value]: _, ...remaining } = selected
        next = remaining
      } else {
        next = { ...selected, [value]: current - 1 }
      }
      setSelected(next)
      onCardsChange(toCards(next))
    },
    [selected, onCardsChange]
  )

  const total = Object.entries(selected).reduce(
    (sum, [value, count]) => {
      const card = CARD_MAP.get(value as CardValue)
      return sum + (card?.points ?? 0) * count
    },
    0
  )

  const clearCards = useCallback(() => {
    setSelected({})
    onCardsChange([])
  }, [onCardsChange])

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1.5">
        {ALL_CARDS.map((card) => {
          const count = selected[card.value] ?? 0
          const isSelected = count > 0
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => toggleCard(card.value)}
              onContextMenu={(e) => {
                e.preventDefault()
                removeCard(card.value)
              }}
              className={`relative flex flex-col items-center justify-center rounded-xl py-3 sm:py-2.5 px-1 text-sm font-medium
                transition-all duration-100 select-none min-h-[48px] sm:min-h-[44px]
                ${isSelected
                  ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900 ring-2 ring-neutral-900 dark:ring-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }
              `}
              title="Toca para agregar, toca de nuevo para quitar"
            >
              <span className="text-sm sm:text-base leading-none">{card.label}</span>
              <span className="text-[10px] opacity-60 mt-0.5">{card.points}</span>
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={clearCards}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors text-xs"
        >
          Limpiar
        </button>
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          Total: <span className="text-lg">{total}</span> pts
        </span>
      </div>

      {/* Summary */}
      {Object.entries(selected).filter(([, c]) => c > 0).length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {Object.entries(selected)
            .filter(([, c]) => c > 0)
            .map(([value, count]) => {
              const card = CARD_MAP.get(value as CardValue)
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2 py-0.5"
                >
                  {card?.label} x{count} ({card ? card.points * count : 0} pts)
                  <button
                    type="button"
                    onClick={() => removeCard(value as CardValue)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )
            })}
        </div>
      )}
    </div>
  )
}
