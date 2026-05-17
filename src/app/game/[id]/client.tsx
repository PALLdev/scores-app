"use client"

import { GameBoard } from "@/components/game/GameBoard"

export function GamePageClient({ gameId }: { gameId: string }) {
  return <GameBoard gameId={gameId} />
}
