import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ScoreTable } from "@/components/game/ScoreTable"
import type { Game } from "@/lib/types"

const mockGame: Game = {
  id: "test-1",
  players: [
    { id: "p1", name: "Ana" },
    { id: "p2", name: "Luis" },
  ],
  rounds: [
    {
      roundNumber: 1,
      scores: [
        { playerId: "p1", points: 10, won: false },
        { playerId: "p2", points: 0, won: true },
      ],
    },
    {
      roundNumber: 2,
      scores: [
        { playerId: "p1", points: 5, won: false },
        { playerId: "p2", points: 15, won: false },
      ],
    },
  ],
  status: "in_progress",
  currentRound: 3,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

describe("ScoreTable", () => {
  it("renders player names", () => {
    render(<ScoreTable game={mockGame} />)
    expect(screen.getByText("Ana")).toBeInTheDocument()
    expect(screen.getByText("Luis")).toBeInTheDocument()
  })

  it("renders round headers", () => {
    render(<ScoreTable game={mockGame} />)
    expect(screen.getByText("R1")).toBeInTheDocument()
    expect(screen.getByText("R2")).toBeInTheDocument()
  })

  it("shows totals", () => {
    render(<ScoreTable game={mockGame} />)
    const items = screen.getAllByText("15")
    expect(items.length).toBeGreaterThanOrEqual(2)
  })

  it("shows ✓ for winner rounds", () => {
    render(<ScoreTable game={mockGame} />)
    const luisRow = screen.getByText("Luis").closest("tr")
    expect(luisRow?.innerHTML).toContain("✓")
  })
})
