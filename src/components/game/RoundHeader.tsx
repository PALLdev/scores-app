"use client"

import { memo } from "react"
import { getRoundCombination } from "@/lib/combinations"

interface RoundHeaderProps {
  roundNumber: number
  isCompleted?: boolean
}

export const RoundHeader = memo(function RoundHeader({ roundNumber, isCompleted = false }: RoundHeaderProps) {
  const combo = getRoundCombination(roundNumber)

  if (!combo) return null

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white text-sm font-semibold dark:bg-white dark:text-neutral-900">
          {roundNumber}
        </span>
        {isCompleted && (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
        {combo.name}
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
        {combo.description} &middot; {combo.cards} cartas
      </p>
    </div>
  )
})
