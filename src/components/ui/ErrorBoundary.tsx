"use client"

import { Component, type ReactNode } from "react"
import { Button } from "./Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Algo salió mal
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-md">
            Ocurrió un error inesperado. Puedes intentar recargar la página.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
