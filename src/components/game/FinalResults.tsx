"use client"

import { Card, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getRoundCombination } from "@/lib/combinations"
import { getPlayerTotal } from "@/lib/utils"
import type { Game } from "@/lib/types"
import { MAX_ROUNDS } from "@/lib/constants"

interface FinalResultsProps {
  game: Game
  onNewGame: () => void
  onGoHome: () => void
}

export function FinalResults({ game, onNewGame, onGoHome }: FinalResultsProps) {
  const sorted = [...game.players]
    .map((p) => ({ player: p, total: getPlayerTotal(game, p.id) }))
    .sort((a, b) => a.total - b.total)

  const winner = sorted[0]

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"]

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <div className="text-center">
        <span className="text-5xl mb-2 block">{medals[0]}</span>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {winner.player.name} ganó la partida
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          con {winner.total} puntos totales
        </p>
      </div>

      <Card>
        <CardTitle>Clasificación final</CardTitle>
        <div className="space-y-2 mt-3">
          {sorted.map(({ player, total }, i) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-xl
                ${i === 0
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  : "bg-neutral-50 dark:bg-neutral-800/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{medals[i] ?? ""}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {player.name}
                </span>
              </div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{total} pts</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Desglose por ronda</CardTitle>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-1.5 pr-2 text-neutral-500 dark:text-neutral-400 font-medium">Ronda</th>
                {sorted.map(({ player }) => (
                  <th key={player.id} className="text-center py-1.5 px-2 text-neutral-500 dark:text-neutral-400 font-medium text-xs">
                    {player.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: MAX_ROUNDS }, (_, i) => {
                const rn = i + 1
                const combo = getRoundCombination(rn)
                return (
                  <tr key={rn} className="border-b border-neutral-100 dark:border-neutral-800/50">
                    <td className="py-1.5 pr-2 text-neutral-600 dark:text-neutral-400 text-xs">
                      {rn}. {combo?.name ?? ""}
                    </td>
                    {sorted.map(({ player }) => {
                      const round = game.rounds.find((r) => r.roundNumber === rn)
                      const score = round?.scores.find((s) => s.playerId === player.id)
                      return (
                        <td key={player.id} className={`text-center py-1.5 px-2
                          ${score?.won ? "text-green-600 dark:text-green-400 font-semibold" : "text-neutral-700 dark:text-neutral-300"}
                        `}>
                          {score?.won ? "0 ✓" : (score?.points ?? "-")}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onGoHome}>
          Volver al inicio
        </Button>
        <Button className="flex-1" onClick={onNewGame}>
          Nueva partida
        </Button>
      </div>
    </div>
  )
}
