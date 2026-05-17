import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CardSelector } from "@/components/game/CardSelector"
import { calculateTotal } from "@/lib/cardValues"
import type { CardValue, CardCount } from "@/lib/types"

describe("CardSelector", () => {
  it("renders all card buttons", () => {
    const onChange = vi.fn()
    render(<CardSelector onCardsChange={onChange} />)
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("K")).toBeInTheDocument()
    expect(screen.getByText("🃏")).toBeInTheDocument()
  })

  it("calls onChange when a card is clicked", async () => {
    const onChange = vi.fn()
    render(<CardSelector onCardsChange={onChange} />)

    await userEvent.click(screen.getByText("A"))
    expect(onChange).toHaveBeenCalledWith([{ value: "A", count: 1 }])
  })

  it("increments count when clicking same card multiple times", async () => {
    const onChange = vi.fn()
    render(<CardSelector onCardsChange={onChange} />)

    const aceBtn = screen.getByText("A")
    await userEvent.click(aceBtn)
    await userEvent.click(aceBtn)

    const calls = onChange.mock.calls
    const lastCall = calls[calls.length - 1][0] as CardCount[]
    const ace = lastCall.find((c: CardCount) => c.value === "A")
    expect(ace?.count).toBe(2)
  })

  it("calculates total correctly with multiple cards", async () => {
    const onChange = vi.fn()
    const { container } = render(<CardSelector onCardsChange={onChange} />)

    const cardButtons = container.querySelectorAll("button")
    const aceBtn = Array.from(cardButtons).find((b) => b.textContent?.includes("A"))
    const kingBtn = Array.from(cardButtons).find((b) => b.textContent?.includes("K"))
    const fiveBtn = Array.from(cardButtons).find((b) => b.textContent?.includes("5"))

    if (aceBtn && kingBtn && fiveBtn) {
      await userEvent.click(aceBtn)
      await userEvent.click(kingBtn)
      await userEvent.click(fiveBtn)
      await userEvent.click(fiveBtn)
    }

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0] as CardCount[]
    const total = calculateTotal(lastCall)
    expect(total).toBe(20 + 10 + 10)
  })

  it("has a clear button", async () => {
    const onChange = vi.fn()
    render(<CardSelector onCardsChange={onChange} />)

    await userEvent.click(screen.getByText("A"))
    await userEvent.click(screen.getByText("Limpiar"))

    expect(onChange).toHaveBeenLastCalledWith([])
  })
})
