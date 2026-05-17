import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { RoundHeader } from "@/components/game/RoundHeader"

describe("RoundHeader", () => {
  it("displays round number and combination name", () => {
    render(<RoundHeader roundNumber={1} />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2 tríos")).toBeInTheDocument()
  })

  it("displays description with card count", () => {
    render(<RoundHeader roundNumber={3} />)
    expect(screen.getByText(/8 cartas/)).toBeInTheDocument()
  })

  it("shows checkmark when completed", () => {
    render(<RoundHeader roundNumber={1} isCompleted />)
    // The checkmark SVG should be rendered
    expect(screen.getByText("2 tríos")).toBeInTheDocument()
  })

  it("returns null for invalid round", () => {
    const { container } = render(<RoundHeader roundNumber={99} />)
    expect(container.innerHTML).toBe("")
  })
})
