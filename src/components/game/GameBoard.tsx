"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useGame } from "@/hooks/useGame"
import { RoundHeader } from "./RoundHeader"
import { ScoreTable } from "./ScoreTable"
import { RoundInput } from "./RoundInput"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import type { CardCount, CardValue } from "@/lib/types"
import { getPlayerTotal } from "@/lib/utils"
import { saveFinishedGame } from "@/lib/db"
import { MAX_PLAYERS, MAX_ROUNDS } from "@/lib/constants"

const AddLatePlayer = dynamic(() => import("./AddLatePlayer").then((m) => ({ default: m.AddLatePlayer })), { ssr: false })
const EditScoreDialog = dynamic(() => import("./EditScoreDialog").then((m) => ({ default: m.EditScoreDialog })), { ssr: false })
const FinalResults = dynamic(() => import("./FinalResults").then((m) => ({ default: m.FinalResults })), { ssr: false })

interface GameBoardProps {
  gameId: string
}

export function GameBoard({ gameId }: GameBoardProps) {
  const router = useRouter()
  const {
    game,
    standings,
    addLatePlayer,
    submitRound,
    undoLastRound,
    editRoundScore,
    finishGame,
  } = useGame(gameId)

  const [currentScores, setCurrentScores] = useState<Record<
    string,
    { points: number; won: boolean; cards?: CardCount[] }
  >>({})
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [editTarget, setEditTarget] = useState<{
    roundNumber: number
    playerId: string
    points: number
    won: boolean
    cards?: CardCount[]
  } | null>(null)

  const currentRound = game?.currentRound ?? 0
  const isLastRound = currentRound >= MAX_ROUNDS
  const roundAlreadySubmitted = game?.rounds.some((r) => r.roundNumber === currentRound) ?? false

  const handleScoreChange = useCallback(
    (playerId: string, points: number, won: boolean, cards?: CardCount[]) => {
      setCurrentScores((prev) => ({ ...prev, [playerId]: { points, won, cards } }))
    },
    []
  )

  const handleSubmitRound = useCallback(() => {
    if (!game) return
    const scores = game.players.map((p) => {
      const s = currentScores[p.id]
      return {
        playerId: p.id,
        points: s?.points ?? 0,
        won: s?.won ?? false,
        cards: s?.cards,
      }
    })
    submitRound(currentRound, scores)

    if (isLastRound) {
      const sorted = [...game.players]
        .map((p) => ({
          name: p.name,
          rounds: game.rounds.map((r) => {
            const sc = r.scores.find((s) => s.playerId === p.id)
            return { round: r.roundNumber, points: sc?.points ?? 0 }
          }),
          total: getPlayerTotal({ ...game, rounds: [...game.rounds, { roundNumber: currentRound, scores: scores.map((s) => ({ playerId: s.playerId, points: s.points, won: s.won })) }] }, p.id),
        }))
        .sort((a, b) => a.total - b.total)

      saveFinishedGame({
        id: game.id,
        createdAt: new Date().toISOString(),
        players: sorted,
        winner: sorted[0].name,
      })
    }

    setCurrentScores({})
  }, [game, currentScores, submitRound, currentRound, isLastRound])

  const handleUndo = useCallback(() => {
    undoLastRound()
    setCurrentScores({})
  }, [undoLastRound])

  const handleEditSave = useCallback(
    (points: number, won: boolean, cards?: CardCount[]) => {
      if (!editTarget) return
      editRoundScore(editTarget.roundNumber, editTarget.playerId, points, won, cards)
    },
    [editTarget, editRoundScore]
  )

  const openEdit = (roundNumber: number, playerId: string) => {
    if (!game) return
    const round = game.rounds.find((r) => r.roundNumber === roundNumber)
    const score = round?.scores.find((s) => s.playerId === playerId)
    if (!score) return
    setEditTarget({
      roundNumber,
      playerId,
      points: score.points,
      won: score.won,
      cards: score.cards,
    })
  }

  const player = editTarget && game
    ? game.players.find((p) => p.id === editTarget.playerId)
    : undefined

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-neutral-500 dark:text-neutral-400">Partida no encontrada</p>
      </div>
    )
  }

  if (game.status === "completed") {
    return (
      <FinalResults
        game={game}
        onNewGame={() => { router.push("/") }}
        onGoHome={() => { router.push("/") }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Header */}
      <RoundHeader
        roundNumber={currentRound}
        isCompleted={roundAlreadySubmitted}
      />

      {/* Score Table */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
            Puntajes
          </h3>
          <div className="flex gap-2">
            {game.rounds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleUndo}>
                Deshacer
              </Button>
            )}
            {game.players.length < MAX_PLAYERS && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPlayer(true)}
              >
                + Agregar jugador
              </Button>
            )}
          </div>
        </div>
        <ScoreTable
          game={game}
          onEditRound={game.rounds.length > 0 ? openEdit : undefined}
        />
      </Card>

      {/* Round Input */}
      {!roundAlreadySubmitted && (
        <Card>
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide mb-4">
            Registrar ronda {currentRound}
          </h3>
          <RoundInput
            key={`round-${currentRound}`}
            roundNumber={currentRound}
            players={game.players}
            currentScores={currentScores}
            onScoreChange={handleScoreChange}
            onSubmit={handleSubmitRound}
          />
        </Card>
      )}

      {roundAlreadySubmitted && (
        <Card>
          <div className="text-center py-3">
            <p className="text-green-600 dark:text-green-400 font-medium">
              Ronda {currentRound} registrada
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Esperando a que comience la siguiente ronda
            </p>
          </div>
        </Card>
      )}

      {/* Add Player Dialog */}
      <AddLatePlayer
        open={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        onAdd={addLatePlayer}
        maxPlayers={5}
        currentCount={game.players.length}
      />

      {/* Edit Score Dialog */}
      {editTarget && player && (
        <EditScoreDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
          player={player}
          roundNumber={editTarget.roundNumber}
          currentPoints={editTarget.points}
          currentWon={editTarget.won}
          currentCards={editTarget.cards}
        />
      )}
    </div>
  )
}
