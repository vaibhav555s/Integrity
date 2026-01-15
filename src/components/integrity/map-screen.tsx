"use client"

import { useState, useCallback } from "react"
import type { Screen } from "@/lib/types"

interface MapScreenProps {
  onNavigate: (screen: Screen) => void
}

interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  projectId: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: string
  budget: string
  discrepancies: number
}

// Mock report data across Mumbai
const mockMarkers: MapMarker[] = [
  {
    id: "1",
    lat: 19.076,
    lng: 72.8777,
    title: "Kurla-Andheri Connector Road",
    projectId: "MH-2024-PWD-01847",
    riskLevel: "HIGH",
    status: "Completion claim disputed",
    budget: "₹4.27 Cr",
    discrepancies: 4,
  },
  {
    id: "2",
    lat: 19.0596,
    lng: 72.8295,
    title: "Dadar Flyover Maintenance",
    projectId: "MH-2024-PWD-01623",
    riskLevel: "MEDIUM",
    status: "Under investigation",
    budget: "₹2.1 Cr",
    discrepancies: 2,
  },
  {
    id: "3",
    lat: 19.1176,
    lng: 72.9088,
    title: "Mulund Water Pipeline",
    projectId: "MH-2024-WRD-00891",
    riskLevel: "LOW",
    status: "Verified complete",
    budget: "₹1.8 Cr",
    discrepancies: 0,
  },
  {
    id: "4",
    lat: 19.0216,
    lng: 72.8416,
    title: "Worli Sea Link Repairs",
    projectId: "MH-2024-PWD-02104",
    riskLevel: "CRITICAL",
    status: "Major discrepancies",
    budget: "₹12.4 Cr",
    discrepancies: 7,
  },
  {
    id: "5",
    lat: 19.0896,
    lng: 72.8656,
    title: "Sion Hospital Extension",
    projectId: "MH-2024-HWD-00456",
    riskLevel: "HIGH",
    status: "Material variance detected",
    budget: "₹8.9 Cr",
    discrepancies: 3,
  },
  {
    id: "6",
    lat: 19.0439,
    lng: 72.8204,
    title: "Lower Parel Station Upgrade",
    projectId: "MH-2024-RLY-01122",
    riskLevel: "LOW",
    status: "Verified complete",
    budget: "₹3.2 Cr",
    discrepancies: 1,
  },
]

type FilterRisk = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export function MapScreen({ onNavigate }: MapScreenProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [filterRisk, setFilterRisk] = useState<FilterRisk>("ALL")

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker)
  }, [])

  const closeSidebar = useCallback(() => {
    setSelectedMarker(null)
  }, [])

  const filteredMarkers = filterRisk === "ALL" ? mockMarkers : mockMarkers.filter((m) => m.riskLevel === filterRisk)

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "text-destructive"
      case "HIGH":
        return "text-destructive"
      case "MEDIUM":
        return "text-caution"
      case "LOW":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  // Geometric marker shapes based on risk
  const getMarkerShape = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "●"
      case "HIGH":
        return "●"
      case "MEDIUM":
        return "▲"
      case "LOW":
        return "□"
      default:
        return "□"
    }
  }

  return (
    <div className="min-h-screen bg-foreground text-background pt-20 relative">
      {/* Top Filter Bar */}
      <div className="absolute top-20 left-0 right-0 z-30 border-b border-background/10 bg-foreground/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-background/60">TERRITORY INTERFACE</h1>

          {/* Filter controls */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-background/40 mr-2">FILTER BY RISK:</span>
            {(["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as FilterRisk[]).map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`
                  px-3 py-1 font-mono text-[10px] tracking-wider
                  border transition-all duration-200
                  ${
                    filterRisk === level
                      ? "border-background bg-background text-foreground"
                      : "border-background/30 text-background/60 hover:border-background/60"
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map Area */}
        <div className={`flex-1 relative transition-all duration-300 ${selectedMarker ? "lg:w-3/4" : "w-full"}`}>
          <div className="absolute inset-0 bg-[#1a1a1a]">
            {/* City grid overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Road network */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,20 Q30,25 50,20 T90,30" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" />
              <path d="M20,10 Q25,40 20,60 T30,90" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none" />
              <path d="M60,5 Q55,30 65,50 T55,95" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" />
              <path d="M5,50 Q40,45 70,55 T95,50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none" />
              <path d="M80,10 Q75,30 85,50 T75,90" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" fill="none" />
              <circle cx="45" cy="40" r="15" fill="rgba(255,100,100,0.08)" />
              <circle cx="70" cy="60" r="10" fill="rgba(255,150,100,0.06)" />
              <circle cx="30" cy="70" r="8" fill="rgba(100,200,255,0.05)" />
            </svg>

            {/* Map markers */}
            {filteredMarkers.map((marker) => {
              const x = ((marker.lng - 72.8) / 0.15) * 80 + 10
              const y = ((19.15 - marker.lat) / 0.15) * 80 + 10
              const isSelected = selectedMarker?.id === marker.id

              return (
                <button
                  key={marker.id}
                  onClick={() => handleMarkerClick(marker)}
                  className={`
                    absolute transform -translate-x-1/2 -translate-y-1/2
                    transition-all duration-200
                    ${isSelected ? "marker-pulse z-20" : "z-10 hover:scale-125"}
                  `}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span
                    className={`
                      ${getRiskTextColor(marker.riskLevel)}
                      ${marker.riskLevel === "CRITICAL" || marker.riskLevel === "HIGH" ? "text-2xl" : ""}
                      ${marker.riskLevel === "MEDIUM" ? "text-xl" : ""}
                      ${marker.riskLevel === "LOW" ? "text-base" : ""}
                    `}
                  >
                    {getMarkerShape(marker.riskLevel)}
                  </span>
                </button>
              )
            })}

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-foreground/90 border border-background/20 p-4">
              <div className="font-mono text-[10px] text-background/60 tracking-wider mb-3">RISK LEGEND</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] text-background/80">
                  <span className="text-destructive text-lg">●</span>
                  <span>CRITICAL / HIGH</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-background/80">
                  <span className="text-caution text-base">▲</span>
                  <span>MEDIUM</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-background/80">
                  <span className="text-accent text-sm">□</span>
                  <span>LOW / VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Map statistics */}
            <div className="absolute top-24 left-4 font-mono text-[10px] text-background/50 space-y-1">
              <div>REGION: GREATER MUMBAI</div>
              <div>PROJECTS TRACKED: {mockMarkers.length}</div>
              <div>
                HIGH RISK: {mockMarkers.filter((m) => m.riskLevel === "HIGH" || m.riskLevel === "CRITICAL").length}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`
            fixed lg:relative right-0 top-20 bottom-0 
            w-full lg:w-96 bg-background border-l border-border
            transform transition-transform duration-300 z-40
            ${selectedMarker ? "translate-x-0" : "translate-x-full lg:translate-x-full"}
          `}
        >
          {selectedMarker && (
            <div className="h-full flex flex-col">
              <div className="border-b border-border p-6 flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-1">ACTIVE REPORT</div>
                  <div className="font-mono text-xs text-muted-foreground">{selectedMarker.projectId}</div>
                </div>
                <button
                  onClick={closeSidebar}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="font-serif text-xl mb-4">{selectedMarker.title}</h2>

                <div
                  className={`
                  inline-block px-3 py-1 mb-6
                  border font-mono text-xs tracking-wider
                  ${
                    selectedMarker.riskLevel === "CRITICAL" || selectedMarker.riskLevel === "HIGH"
                      ? "border-destructive text-destructive"
                      : selectedMarker.riskLevel === "MEDIUM"
                        ? "border-caution text-caution"
                        : "border-accent text-accent"
                  }
                `}
                >
                  {selectedMarker.riskLevel} RISK
                </div>

                <div className="border border-border divide-y divide-border">
                  <div className="flex justify-between p-3">
                    <span className="font-mono text-[10px] text-muted-foreground">STATUS</span>
                    <span className="font-mono text-xs text-right">{selectedMarker.status}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="font-mono text-[10px] text-muted-foreground">BUDGET</span>
                    <span className="font-mono text-xs">{selectedMarker.budget}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="font-mono text-[10px] text-muted-foreground">DISCREPANCIES</span>
                    <span
                      className={`font-mono text-xs ${selectedMarker.discrepancies > 0 ? "text-destructive" : "text-accent"}`}
                    >
                      {selectedMarker.discrepancies} flagged
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="font-mono text-[10px] text-muted-foreground">COORDINATES</span>
                    <span className="font-mono text-[10px]">
                      {selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => onNavigate("audit")}
                    className="
                      w-full px-4 py-3
                      border border-foreground
                      font-mono text-xs tracking-wider uppercase
                      hover:bg-foreground hover:text-background
                      transition-all duration-200
                    "
                  >
                    View Full Audit Report
                  </button>
                  <button
                    className="
                      w-full px-4 py-3
                      font-mono text-xs tracking-wider text-muted-foreground
                      underline underline-offset-4
                      hover:text-foreground
                      transition-all duration-200
                    "
                  >
                    Download Evidence Package
                  </button>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="font-mono text-[10px] text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString("en-IN")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
