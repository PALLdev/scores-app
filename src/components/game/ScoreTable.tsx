"use client"

import { memo, useMemo } from "react"
import type { Game } from "@/lib/types"
import { getPlayerTotal } from "@/lib/utils"

interface ScoreTableProps {
  game: Game
  onEditRound?: (roundNumber: number, playerId: string) => void
}

export const ScoreTable = memo(function ScoreTable({ game, onEditRound }: ScoreTableProps) {
  const maxRound = useMemo(
    () => Math.max(...game.rounds.map((r) => r.roundNumber), 0),
    [game.rounds]
  )
  const totals = useMemo(
    () => Object.fromEntries(
      game.players.map((p) => [p.id, getPlayerTotal(game, p.id)])
    ),
    [game]
  )

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400 sticky left-0 bg-white dark:bg-neutral-900">
              Jugador
            </th>
            {Array.from({ length: maxRound }, (_, i) => (
              <th
                key={i + 1}
                className="text-center py-2.5 px-2 font-medium text-neutral-500 dark:text-neutral-400 text-xs"
              >
                R{i + 1}
              </th>
            ))}
            <th className="text-center py-2.5 px-3 font-semibold text-neutral-700 dark:text-neutral-300">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {game.players.map((player) => (
            <tr
              key={player.id}
              className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
            >
              <td className="py-2.5 px-3 font-medium text-neutral-900 dark:text-neutral-100 sticky left-0 bg-white dark:bg-neutral-900">
                {player.name}
              </td>
              {Array.from({ length: maxRound }, (_, i) => {
                const round = game.rounds.find((r) => r.roundNumber === i + 1)
                const score = round?.scores.find((s) => s.playerId === player.id)
                const val = score?.points ?? "-"
                const won = score?.won
                return (
                  <td
                    key={i + 1}
                    className={`text-center py-2.5 px-2 text-sm cursor-pointer
                      ${won ? "text-green-600 dark:text-green-400 font-semibold" : "text-neutral-700 dark:text-neutral-300"}
                      ${onEditRound && round ? "hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded" : ""}
                    `}
                    onClick={() => {
                      if (onEditRound && round) onEditRound(i + 1, player.id)
                    }}
                  >
                    {won ? "0 ✓" : val}
                  </td>
                )
              })}
              <td className="text-center py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                {totals[player.id]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
