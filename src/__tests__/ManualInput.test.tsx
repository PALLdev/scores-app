import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ManualInput } from "@/components/game/ManualInput"

describe("ManualInput", () => {
  it("renders with placeholder", () => {
    render(<ManualInput value={null} onChange={() => {}} />)
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument()
  })

  it("displays current value", () => {
    render(<ManualInput value={42} onChange={() => {}} />)
    expect(screen.getByDisplayValue("42")).toBeInTheDocument()
  })

  it("calls onChange with typed value", () => {
    const onChange = vi.fn()
    render(<ManualInput value={0} onChange={onChange} />)
    const input = screen.getByPlaceholderText("0")
    fireEvent.change(input, { target: { value: "35" } })
    expect(onChange).toHaveBeenCalledWith(35)
  })
})
