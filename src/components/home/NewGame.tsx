"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useGameStore } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardTitle } from "@/components/ui/Card"
import { getFinishedGames } from "@/lib/db"
import type { FinishedGameData } from "@/lib/types"
import { MAX_PLAYERS, MIN_PLAYERS } from "@/lib/constants"

export function NewGame() {
  const router = useRouter()
  const { createGame, games } = useGameStore()
  const [names, setNames] = useState<string[]>(["", ""])
  const [error, setError] = useState("")

  const [finishedGames, setFinishedGames] = useState<FinishedGameData[]>([])

  const refreshFinishedGames = useCallback(() => {
    setFinishedGames(getFinishedGames())
  }, [])

  useEffect(() => {
    refreshFinishedGames()
    window.addEventListener("focus", refreshFinishedGames)
    return () => window.removeEventListener("focus", refreshFinishedGames)
  }, [refreshFinishedGames])

  const activeGames = Object.values(games).filter((g) => g.status === "in_progress")

  const handleNameChange = (index: number, value: string) => {
    const next = [...names]
    next[index] = value
    setNames(next)
    setError("")
  }

  const addPlayer = () => {
    if (names.length >= MAX_PLAYERS) return
    setNames([...names, ""])
  }

  const removePlayer = (index: number) => {
    if (names.length <= MIN_PLAYERS) return
    setNames(names.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const filled = names.map((n) => n.trim()).filter(Boolean)
    if (filled.length < MIN_PLAYERS) {
      setError(`Mínimo ${MIN_PLAYERS} jugadores`)
      return
    }
    const id = createGame(filled)
    router.push(`/game/${id}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Scores Carioca
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Registra los puntajes de tus partidas
        </p>
      </div>

      {/* Active Games */}
      {activeGames.length > 0 && (
        <Card>
          <CardTitle>Partidas en curso</CardTitle>
          <div className="space-y-2 mt-2">
            {activeGames.map((g) => (
              <Link
                key={g.id}
                href={`/game/${g.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl
                  bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700
                  transition-colors text-left no-underline"
              >
                <div>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {g.players.map((p) => p.name).join(", ")}
                  </span>
                  <span className="text-xs text-neutral-400 ml-2">
                    Ronda {g.currentRound}/10
                  </span>
                </div>
                <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* New Game */}
      <Card>
        <CardTitle>Nueva partida</CardTitle>
        <div className="space-y-2.5 mt-3">
          {names.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 w-5 text-right">
                {i + 1}.
              </span>
              <div className="flex-1">
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Jugador ${i + 1}`}
                  onKeyDown={(e) => { if (e.key === "Enter" && i === names.length - 1) handleSubmit() }}
                />
              </div>
              {names.length > 2 && (
                <button
                  type="button"
                  onClick={() => removePlayer(i)}
                  className="text-neutral-300 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {names.length < 5 && (
          <button
            type="button"
            onClick={addPlayer}
            className="mt-2 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
          >
            + Agregar jugador
          </button>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

        <Button className="w-full mt-4" size="lg" onClick={handleSubmit}>
          Iniciar partida
        </Button>
      </Card>

      {/* Finished Games History */}
      {finishedGames.length > 0 && (
        <Card>
          <CardTitle>Historial</CardTitle>
          <div className="space-y-2 mt-2">
            {finishedGames
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                >
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{g.winner}</span>
                    {" ganó — "}
                    {g.players.map((p) => `${p.name} (${p.total})`).join(", ")}
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(g.createdAt).toLocaleDateString("es-CL")}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
