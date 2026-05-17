"use client"

import { memo } from "react"

interface ManualInputProps {
  value: number | null
  onChange: (value: number) => void
}

export const ManualInput = memo(function ManualInput({ value, onChange }: ManualInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Ingreso manual
      </label>
      <div className="relative">
        <input
          type="number"
          min={0}
          max={500}
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-center text-2xl font-bold
            text-neutral-900 transition-colors
            focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/30
            dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
            dark:focus:border-neutral-500 dark:focus:ring-neutral-400/20
            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500">
          pts
        </span>
      </div>
    </div>
  )
})
