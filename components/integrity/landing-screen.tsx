"use client"

import { useEffect, useState } from "react"
import type { Screen } from "@/lib/types"

interface LandingScreenProps {
  onNavigate: (screen: Screen) => void
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Scanline overlay */}
      <div className="scanline-overlay absolute inset-0 z-10" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-20 min-h-screen flex">
        {/* Left 60% - Typographic Statement */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center px-6 md:px-12 lg:px-16 py-32">
          <div className="max-w-2xl">
            {/* Manifesto headline */}
            <h1
              className={`
                font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                leading-[1.1] tracking-tight
                transition-all duration-500
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              Public projects.
              <br />
              Public money.
              <br />
              <span className="text-accent">Public truth.</span>
            </h1>

            {/* Statistical hook */}
            <p
              className={`
                font-mono text-sm md:text-base text-muted-foreground mt-8 md:mt-12
                tracking-wide leading-relaxed
                transition-all duration-500 delay-200
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              ₹2.3 trillion in civic projects annually.
              <br />
              How many actually exist as claimed?
            </p>

            {/* Stacked CTAs - different visual weights */}
            <div
              className={`
                flex flex-col gap-4 mt-12 md:mt-16
                transition-all duration-500 delay-300
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              {/* Primary CTA - outline button */}
              <button
                onClick={() => onNavigate("document")}
                className="
                  w-fit px-8 py-4 
                  border border-foreground 
                  font-mono text-sm tracking-[0.15em] uppercase
                  hover:bg-foreground hover:text-background
                  transition-all duration-200
                "
              >
                Submit Official Record
              </button>

              {/* Secondary CTA - text only with underline */}
              <button
                onClick={() => onNavigate("evidence")}
                className="
                  w-fit 
                  font-mono text-sm tracking-[0.1em] text-muted-foreground
                  underline underline-offset-4 decoration-muted-foreground/30
                  hover:decoration-foreground hover:text-foreground
                  transition-all duration-200
                "
              >
                File Ground Evidence
              </button>
            </div>
          </div>
        </div>

        {/* Right 40% - Evidence Preview */}
        <div className="hidden lg:flex w-[40%] relative">
          {/* Monochrome infrastructure preview */}
          <div className="absolute inset-0 bg-secondary">
            <div
              className={`
                absolute inset-8 border border-border
                transition-all duration-700 delay-500
                ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              {/* Simulated surveillance/monitoring aesthetic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* Placeholder for infrastructure imagery */}
                  <div className="w-full h-64 bg-muted flex items-center justify-center mb-4">
                    <span className="font-mono text-xs text-muted-foreground tracking-widest">
                      LIVE FEED: SECTOR 7-A
                    </span>
                  </div>

                  {/* Metadata overlay */}
                  <div className="font-mono text-[10px] text-muted-foreground tracking-wider text-left px-4">
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span>TIMESTAMP</span>
                      <span>2024-12-15 14:32:07 IST</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span>COORDINATES</span>
                      <span>19.0760° N, 72.8777° E</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>STATUS</span>
                      <span className="text-caution">PENDING VERIFICATION</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner markers - surveillance aesthetic */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-muted-foreground/30" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-muted-foreground/30" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-muted-foreground/30" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-muted-foreground/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom statistics bar */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-30
          border-t border-border bg-background/80 backdrop-blur-sm
          transition-all duration-500 delay-700
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 md:px-12 py-4 gap-4">
          <div className="flex items-center gap-8 font-mono text-[10px] md:text-xs tracking-wider text-muted-foreground">
            <div>
              <span className="block text-foreground text-lg md:text-xl font-serif">1,247</span>
              <span>REPORTS FILED</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-border" />
            <div>
              <span className="block text-foreground text-lg md:text-xl font-serif">₹847Cr</span>
              <span>DISCREPANCIES FLAGGED</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-border" />
            <div>
              <span className="block text-foreground text-lg md:text-xl font-serif">23</span>
              <span>DISTRICTS COVERED</span>
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            SYSTEM STATUS: <span className="text-accent">● OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
