"use client"

import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/types"

interface NavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const links: { screen: Screen; label: string }[] = [
    { screen: "document", label: "SUBMIT RECORD" },
    { screen: "evidence", label: "FILE EVIDENCE" },
    { screen: "map", label: "TERRITORY" },
  ]

  return (
    <nav className="fixed top-0 right-0 z-50 p-6 md:p-8">
      <div className="flex items-center gap-6 md:gap-8">
        {links.map(({ screen, label }) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className={cn(
              "font-mono text-xs tracking-[0.2em] uppercase transition-all duration-200",
              "border-b border-transparent hover:border-foreground",
              currentScreen === screen && "border-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
