import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Scores Carioca",
  description: "Registra los puntajes de tus partidas de Carioca",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-zinc-50 font-sans antialiased dark:bg-black">
        <div className="min-h-dvh flex flex-col">
          <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
              <a href="/" className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                Scores Carioca
              </a>
              <nav className="flex items-center gap-1">
                <Link
                  href="/historial"
                  className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Historial
                </Link>
                <DarkModeToggle />
              </nav>
            </div>
          </header>
          <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </body>
    </html>
  )
}
