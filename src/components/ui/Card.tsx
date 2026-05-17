"use client"

import { type HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5
        dark:border-neutral-800 dark:bg-neutral-900
        ${hover ? "transition-shadow hover:shadow-md dark:hover:shadow-neutral-950/50" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-semibold text-neutral-900 dark:text-neutral-100 ${className}`}
      {...props}
    />
  )
}
