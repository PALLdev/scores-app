"use client"

import { useState } from "react"
import { Dialog, DialogActions } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MAX_PLAYERS } from "@/lib/constants"

interface AddLatePlayerProps {
  open: boolean
  onClose: () => void
  onAdd: (name: string) => void
  maxPlayers: number
  currentCount: number
}

export function AddLatePlayer({
  open,
  onClose,
  onAdd,
  maxPlayers,
  currentCount,
}: AddLatePlayerProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Ingresa un nombre")
      return
    }
    if (currentCount >= maxPlayers) {
      setError(`Máximo ${maxPlayers} jugadores`)
      return
    }
    onAdd(trimmed)
    setName("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Agregar jugador">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Comenzará con el puntaje más alto actual (desventaja).
      </p>
      <Input
        label="Nombre del jugador"
        value={name}
        onChange={(e) => { setName(e.target.value); setError("") }}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
        placeholder="Ej: Carlos"
        error={error}
        autoFocus
      />
      <DialogActions>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Agregar</Button>
      </DialogActions>
    </Dialog>
  )
}
