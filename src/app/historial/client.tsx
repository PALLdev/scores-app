"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogActions } from "@/components/ui/Dialog"
import { getFinishedGames, deleteFinishedGame } from "@/lib/db"
import type { FinishedGameData } from "@/lib/types"

export function HistoryPage() {
  const [games, setGames] = useState<FinishedGameData[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setGames(getFinishedGames())
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [refresh])

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteFinishedGame(deleteTarget)
    setDeleteTarget(null)
    refresh()
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Historial
        </h1>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>

      {games.length === 0 ? (
        <Card>
          <CardTitle>Sin partidas</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Aún no hay partidas finalizadas.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {[...games]
            .reverse()
            .map((g) => (
              <Card key={g.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      🏆 {g.winner}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(g.createdAt).toLocaleDateString("es-CL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 space-y-0.5">
                      {g.players.map((p) => (
                        <p key={p.name}>
                          {p.name}: <span className="font-medium text-neutral-800 dark:text-neutral-200">{p.total} pts</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(g.id)}
                    className="shrink-0 text-neutral-300 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400 transition-colors p-1"
                    aria-label="Eliminar del historial"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar del historial"
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          ¿Estás seguro? Esta acción no se puede deshacer.
        </p>
        <DialogActions>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
