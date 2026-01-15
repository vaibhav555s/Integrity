"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import type { Screen, EvidenceMetadata, IssueCategory } from "@/lib/types"

interface EvidenceScreenProps {
  onNavigate: (screen: Screen) => void
  onEvidenceSubmitted: (metadata: EvidenceMetadata, issues: string[], image: string) => void
}

const issueCategories: IssueCategory[] = [
  { id: "incomplete", label: "INCOMPLETE WORK", icon: "◧" },
  { id: "quality", label: "QUALITY DEFECT", icon: "◨" },
  { id: "material", label: "MATERIAL VARIANCE", icon: "◩" },
  { id: "measurement", label: "MEASUREMENT GAP", icon: "◪" },
  { id: "safety", label: "SAFETY HAZARD", icon: "◆" },
  { id: "environmental", label: "ENVIRONMENTAL", icon: "◇" },
  { id: "accessibility", label: "ACCESSIBILITY", icon: "□" },
  { id: "other", label: "OTHER ISSUE", icon: "○" },
]

export function EvidenceScreen({ onNavigate, onEvidenceSubmitted }: EvidenceScreenProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  
  // Ref to trigger file input programmatically
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulated auto-populated metadata
  const metadata: EvidenceMetadata = {
    timestamp: new Date().toISOString(),
    coordinates: { lat: 19.076, lng: 72.8777 },
    weather: "PARTLY CLOUDY",
    lighting: "DAYLIGHT",
  }

  const handleCapture = useCallback(() => {
    setIsCapturing(true)
    // Simulate camera capture delay
    setTimeout(() => {
      // FIX: Use a real URL so the demo works immediately without local files
      setCapturedImage("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop")
      setIsCapturing(false)
    }, 800)
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const toggleIssue = useCallback((issueId: string) => {
    setSelectedIssues((prev) => (prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId]))
  }, [])

  const handleSubmit = useCallback(() => {
    if (capturedImage && selectedIssues.length > 0) {
      // Log for debugging since we aren't using Firebase yet
      console.log("Submitting Evidence:", {
        metadata,
        issues: selectedIssues,
        image: capturedImage.substring(0, 50) + "..." // Truncate base64 for log
      })
      
      // Pass the image data up so the Audit Screen can see it
      onEvidenceSubmitted(metadata, selectedIssues, capturedImage)
      onNavigate("audit")
    }
  }, [capturedImage, selectedIssues, onEvidenceSubmitted, onNavigate, metadata])

  return (
    <div className="min-h-screen bg-foreground text-background pt-20">
      {/* Header */}
      <div className="border-b border-background/20 px-6 md:px-12 py-6">
        <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-background/60">FIELD REPORT INTERFACE</h1>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Left - Viewfinder / Image Preview */}
        <div className="w-full lg:w-2/3 relative">
          {/* Top Metadata Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-foreground/90 backdrop-blur-sm border-b border-background/10">
            <div className="flex items-center justify-between px-4 py-2 font-mono text-[10px] text-background/60 tracking-wider">
              <div className="flex items-center gap-4">
                <span>
                  {metadata.coordinates.lat.toFixed(4)}° N, {metadata.coordinates.lng.toFixed(4)}° E
                </span>
                <span className="text-background/30">|</span>
                <span>{new Date(metadata.timestamp).toLocaleString("en-IN", { hour12: false })}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-0.5 border border-background/30">{metadata.weather}</span>
                <span className="px-2 py-0.5 border border-background/30">{metadata.lighting}</span>
              </div>
            </div>
          </div>

          {/* Main viewfinder area */}
          <div className="relative h-[50vh] lg:h-full flex items-center justify-center bg-foreground overflow-hidden">
            {!capturedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* DSLR viewfinder grid overlay */}
                <div className="absolute inset-8 pointer-events-none z-10">
                  {/* Rule of thirds grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-background/10" />
                    ))}
                  </div>

                  {/* Center focus point */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 border border-background/30">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-background/20" />
                      <div className="absolute top-0 left-1/2 w-px h-full bg-background/20" />
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-background/40" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-background/40" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-background/40" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-background/40" />
                </div>

                {/* Exposure/focus indicators (non-functional, aesthetic) */}
                <div className="absolute bottom-12 left-8 flex items-center gap-4 font-mono text-[10px] text-background/40 z-10">
                  <span>EV +0.0</span>
                  <span>ISO AUTO</span>
                  <span>f/2.8</span>
                </div>

                <div className="text-center z-20">
                  <p className="font-mono text-xs text-background/60 tracking-widest mb-6">AWAITING EVIDENCE CAPTURE</p>

                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleCapture}
                      disabled={isCapturing}
                      className="
                        px-8 py-4 bg-background text-foreground
                        font-mono text-xs tracking-[0.2em] uppercase
                        hover:bg-background/90
                        transition-all duration-200
                        disabled:opacity-50
                      "
                    >
                      {isCapturing ? "CAPTURING..." : "CAPTURE EVIDENCE"}
                    </button>

                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer font-mono text-[10px] text-background/40 underline underline-offset-4 hover:text-background/60"
                    >
                      OR UPLOAD FROM DEVICE
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Captured image - full bleed */}
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured evidence"
                  className="w-full h-full object-cover"
                />

                {/* Image overlay info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[10px] text-background/80">
                      <span className="text-accent">● REC</span>
                      <span className="ml-4">EVIDENCE CAPTURED</span>
                    </div>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="font-mono text-[10px] text-background/60 underline underline-offset-2 hover:text-background"
                    >
                      RETAKE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Issue Taxonomy */}
        <div className="w-full lg:w-1/3 bg-secondary border-l border-border p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="mb-6">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-foreground mb-1">ISSUE CLASSIFICATION</h2>
            <p className="font-mono text-[10px] text-muted-foreground">SELECT ALL APPLICABLE CATEGORIES</p>
          </div>

          {/* Visual taxonomy grid */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {issueCategories.map((category) => {
              const isSelected = selectedIssues.includes(category.id)
              return (
                <button
                  key={category.id}
                  onClick={() => toggleIssue(category.id)}
                  className={`
                    p-4 border text-left transition-all duration-200
                    ${
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background border-border hover:border-foreground/50"
                    }
                  `}
                >
                  <span
                    className={`
                    text-xl mb-2 block
                    ${isSelected ? "text-background" : "text-muted-foreground"}
                  `}
                  >
                    {category.icon}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider block">{category.label}</span>
                </button>
              )
            })}
          </div>

          {/* Selected issues summary */}
          {selectedIssues.length > 0 && (
            <div className="mb-6 p-4 border border-border bg-background">
              <p className="font-mono text-[10px] text-muted-foreground mb-2">
                {selectedIssues.length} ISSUE{selectedIssues.length > 1 ? "S" : ""} FLAGGED
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedIssues.map((id) => {
                  const category = issueCategories.find((c) => c.id === id)
                  return (
                    <span key={id} className="font-mono text-[9px] px-2 py-1 bg-foreground text-background">
                      {category?.icon} {category?.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notes field */}
          <div className="mb-8">
            <label className="block font-mono text-[10px] tracking-wider text-muted-foreground mb-2">
              ADDITIONAL NOTES
            </label>
            <textarea
              className="
                w-full h-24 p-3 
                bg-background border border-border
                font-mono text-xs
                focus:border-foreground focus:outline-none
                resize-none
              "
              placeholder="Optional field observations..."
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!capturedImage || selectedIssues.length === 0}
            className="
              w-full px-6 py-4 
              border border-foreground bg-foreground text-background
              font-mono text-xs tracking-[0.15em] uppercase
              hover:bg-background hover:text-foreground
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            Submit Field Report
          </button>
        </div>
      </div>
    </div>
  )
}