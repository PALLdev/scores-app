const NAME_MAX_LENGTH = 30
const NAME_MIN_LENGTH = 1
const SCORE_MAX = 500
const SCORE_MIN = 0

const INVALID_NAME_PATTERN = /[<>&"']/

export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return "El nombre no puede estar vacío"
  if (trimmed.length < NAME_MIN_LENGTH) return "El nombre debe tener al menos 1 carácter"
  if (trimmed.length > NAME_MAX_LENGTH) return `El nombre no puede exceder ${NAME_MAX_LENGTH} caracteres`
  if (INVALID_NAME_PATTERN.test(trimmed)) return "El nombre contiene caracteres no válidos"
  return null
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/[<>&"']/g, "").slice(0, NAME_MAX_LENGTH)
}

export function validateScore(points: number): string | null {
  if (!Number.isFinite(points)) return "Puntaje inválido"
  if (points < SCORE_MIN || points > SCORE_MAX) return `El puntaje debe estar entre ${SCORE_MIN} y ${SCORE_MAX}`
  if (!Number.isInteger(points)) return "El puntaje debe ser un número entero"
  return null
}
