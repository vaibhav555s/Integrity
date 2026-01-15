"use client"

import type { Screen } from "@/lib/types"

interface LogoProps {
  onNavigate: (screen: Screen) => void
}

export function Logo({ onNavigate }: LogoProps) {
  return (
    <button onClick={() => onNavigate("landing")} className="fixed top-6 left-6 md:top-8 md:left-8 z-50 group">
      <div className="flex items-center gap-3">
        {/* Custom geometric glyph - not from icon library */}
        <div className="w-8 h-8 border border-foreground flex items-center justify-center">
          <div className="w-4 h-4 bg-foreground" />
        </div>
        <span className="font-mono text-xs tracking-[0.3em] uppercase group-hover:tracking-[0.4em] transition-all duration-200">
          INTEGRITY
        </span>
      </div>
    </button>
  )
}
