"use client"

import { useState, useEffect, useCallback } from "react"
import type { Screen, ProjectRecord, AuditVerdict } from "@/lib/types"
import { generateAuditVerdict } from "@/lib/audit-service" // Import the service

interface AuditScreenProps {
  onNavigate: (screen: Screen) => void
  projectRecord?: ProjectRecord | null
  evidenceImage?: string | null // NEW PROP
}

type AuditStep = "idle" | "retrieve" | "audit" | "verdict" | "complete"

// Keep mock data only as a fallback for the record
const mockProjectData: ProjectRecord = {
  project_id: "MH-2024-PWD-MOCK",
  title: "Mock Project Record",
  budget: "₹0",
  contractor: "Unknown",
  status: "Unknown",
  completion_date: "N/A",
  sanctioned_by: "N/A",
}

export function AuditScreen({ onNavigate, projectRecord, evidenceImage }: AuditScreenProps) {
  const [currentStep, setCurrentStep] = useState<AuditStep>("idle")
  const [showVerdict, setShowVerdict] = useState(false)
  const [retrieveProgress, setRetrieveProgress] = useState(0)
  const [auditProgress, setAuditProgress] = useState(0)
  
  // State for the Real AI Verdict
  const [verdict, setVerdict] = useState<AuditVerdict | null>(null)
  const [isAiProcessing, setIsAiProcessing] = useState(false)

  const record = projectRecord || mockProjectData

  // --- THE REAL AI LOGIC ---
  const performAiAnalysis = async () => {
    if (!evidenceImage) {
      // Handle case where no image exists (shouldn't happen in flow)
      setVerdict({
        risk_level: "LOW",
        confidence: 1,
        discrepancies: ["No photographic evidence provided"],
        recommendation: "Upload evidence to perform audit."
      });
      return;
    }

    setIsAiProcessing(true);
    // Call the service we created in Step 1
    const result = await generateAuditVerdict(record, evidenceImage);
    setVerdict(result);
    setIsAiProcessing(false);
  };

  const startAudit = useCallback(() => {
    setCurrentStep("retrieve")
    performAiAnalysis() // Trigger AI when button is clicked
  }, [])

  // Step 1: RETRIEVE - Visual Timer
  useEffect(() => {
    if (currentStep !== "retrieve") return

    const interval = setInterval(() => {
      setRetrieveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setCurrentStep("audit"), 500)
          return 100
        }
        return prev + 4 // Speed of "Scanning"
      })
    }, 40)

    return () => clearInterval(interval)
  }, [currentStep])

  // Step 2: AUDIT - Comparison Analysis
  useEffect(() => {
    if (currentStep !== "audit") return

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        // If AI is still thinking, pause progress at 90%
        if (prev >= 90 && isAiProcessing) {
          return 90;
        }

        if (prev >= 100) {
          clearInterval(interval)
          // Ensure we have a verdict before moving on
          if (verdict) {
            setTimeout(() => setCurrentStep("verdict"), 500)
          }
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [currentStep, isAiProcessing, verdict])

  // Step 3: VERDICT - Reveal
  useEffect(() => {
    if (currentStep !== "verdict") return

    const timer = setTimeout(() => {
      setShowVerdict(true)
      setTimeout(() => setCurrentStep("complete"), 2500)
    }, 200)

    return () => clearTimeout(timer)
  }, [currentStep])

  // Helper for colors
  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-destructive"
      case "HIGH": return "text-destructive"
      case "MEDIUM": return "text-yellow-500" // Use tailwind yellow if caution not defined
      case "LOW": return "text-green-500" // Use tailwind green if accent not defined
      default: return "text-foreground"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-destructive/10 border-destructive"
      case "HIGH": return "bg-destructive/10 border-destructive"
      case "MEDIUM": return "bg-yellow-500/10 border-yellow-500"
      case "LOW": return "bg-green-500/10 border-green-500"
      default: return "bg-secondary border-border"
    }
  }

  // Safe fallback if verdict is not ready yet (prevents crash)
  const displayVerdict = verdict || {
    risk_level: "ANALYZING",
    confidence: 0,
    discrepancies: ["Processing data..."],
    recommendation: "Please wait..."
  }

  return (
    <div className="min-h-screen bg-background pt-20 relative">
      {/* Verdict overlay */}
      {currentStep === "verdict" && showVerdict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground">
          <div className="text-center horizontal-wipe">
            <div className={`text-8xl md:text-9xl font-serif tracking-tight ${getRiskColor(displayVerdict.risk_level)}`}>
              {displayVerdict.risk_level}
            </div>
            <div className="mt-4 font-mono text-sm text-background/60 tracking-widest">
              RISK ASSESSMENT COMPLETE — {Math.round(displayVerdict.confidence * 100)}% CONFIDENCE
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-6">
        <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">VERIFICATION CHAMBER</h1>
      </div>

      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Left - Vertical Timeline */}
        <div className="w-16 md:w-24 border-r border-border flex flex-col py-8">
          {["RETRIEVE", "AUDIT", "VERDICT"].map((step, index) => {
            const stepKey = step.toLowerCase() as AuditStep
            const isActive =
              currentStep === stepKey ||
              (currentStep === "complete" && true) ||
              (currentStep === "audit" && index === 0) ||
              (currentStep === "verdict" && index <= 1)
            const isCurrent = currentStep === stepKey

            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {index > 0 && (
                  <div
                    className={`absolute top-0 w-px h-full -translate-y-1/2 transition-all duration-500 ${isActive ? "bg-foreground" : "bg-border"}`}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 flex items-center justify-center transition-all duration-200 ${isCurrent ? "border-2 border-foreground bg-foreground" : isActive ? "border border-foreground bg-foreground" : "border border-border bg-background"}`}
                >
                  <span className={`font-mono text-xs ${isCurrent || isActive ? "text-background" : "text-muted-foreground"}`}>
                    {index + 1}
                  </span>
                </div>
                <span
                  className={`font-mono text-[8px] md:text-[10px] tracking-widest mt-2 writing-mode-vertical md:writing-mode-horizontal ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                  style={{ writingMode: "vertical-rl" }}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Main Panel */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {/* STATE: IDLE */}
          {currentStep === "idle" && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center max-w-lg">
                <h2 className="font-serif text-3xl md:text-4xl mb-6">Initiate Verification</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8 leading-relaxed">
                  The AI audit system will analyze submitted documents against field evidence.
                </p>
                <div className="border border-border p-6 mb-8 text-left">
                  <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4">TARGET PROJECT</div>
                  <div className="font-serif text-lg mb-2">{record.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">{record.project_id}</div>
                </div>
                <button
                  onClick={startAudit}
                  className="px-8 py-4 border-2 border-foreground font-mono text-sm tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all duration-200"
                >
                  Begin Automated Audit
                </button>
              </div>
            </div>
          )}

          {/* STATE: STEPS 1-3 */}
          {(currentStep !== "idle") && (
            <>
              {/* SECTION 1: DOCUMENT DATA */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                    <span className="text-background font-mono text-xs">1</span>
                  </div>
                  <h3 className="font-mono text-sm tracking-[0.15em] uppercase">RETRIEVE — Document Reconstruction</h3>
                  {currentStep !== "retrieve" && <span className="font-mono text-xs text-green-500 ml-auto">COMPLETE</span>}
                </div>

                <div className={`border border-border p-6 ${currentStep === "retrieve" ? "horizontal-wipe" : ""}`}>
                  {currentStep === "retrieve" && (
                    <div className="mb-4">
                      <div className="h-1 bg-border">
                        <div className="h-full bg-foreground transition-all duration-100" style={{ width: `${retrieveProgress}%` }} />
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-2">SCANNING DOCUMENT... {retrieveProgress}%</p>
                    </div>
                  )}
                  {/* Data Display */}
                  <div className="font-mono text-xs space-y-2 bg-secondary/50 p-4">
                    {Object.entries(record).map(([key, value], index) => {
                      // Only show primitive values
                      if (typeof value === "object") return null;
                      return (
                        <div key={key} className="flex justify-between">
                           <span className="text-muted-foreground uppercase">{key.replace(/_/g, " ")}</span>
                           <span className="text-foreground">{value as string}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 2: AUDIT COMPARISON */}
              {(currentStep === "audit" || currentStep === "verdict" || currentStep === "complete") && (
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                      <span className="text-background font-mono text-xs">2</span>
                    </div>
                    <h3 className="font-mono text-sm tracking-[0.15em] uppercase">AUDIT — Comparative Analysis</h3>
                    {currentStep !== "audit" && <span className="font-mono text-xs text-green-500 ml-auto">COMPLETE</span>}
                  </div>

                  <div className={`border border-border ${currentStep === "audit" ? "horizontal-wipe" : ""}`}>
                     {/* Progress Bar */}
                    {currentStep === "audit" && (
                      <div className="p-4 border-b border-border">
                        <div className="h-1 bg-border">
                          <div className="h-full bg-foreground transition-all duration-100" style={{ width: `${auditProgress}%` }} />
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground mt-2">
                           {isAiProcessing ? "AI ANALYZING IMAGERY..." : "FINALIZING VERDICT..."} {auditProgress}%
                        </p>
                      </div>
                    )}

                    {/* Comparison Grid */}
                    <div className="grid md:grid-cols-2">
                      <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                        <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <span>■</span> OFFICIAL RECORD
                        </div>
                        <div className="space-y-3">
                           <p className="font-mono text-xs">Status: <span className="font-bold">{record.status}</span></p>
                           <p className="font-mono text-xs">Budget: {record.budget}</p>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <span>◇</span> FIELD EVIDENCE
                        </div>
                         {/* Display thumbnail of the evidence image */}
                        {evidenceImage && (
                          <div className="mb-4 h-32 w-full bg-black/5 overflow-hidden relative">
                             <img src={evidenceImage} alt="Evidence" className="object-cover w-full h-full opacity-80" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Discrepancies (Only show if available) */}
                    {verdict && (
                        <div className="border-t border-border p-6 bg-destructive/5">
                        <div className="font-mono text-[10px] tracking-wider text-destructive mb-4">
                            ▲ AI DETECTED DISCREPANCIES
                        </div>
                        <div className="space-y-2">
                            {verdict.discrepancies.map((d, i) => (
                            <div key={i} className="flex items-start gap-3 font-mono text-xs">
                                <span className="text-destructive">—</span>
                                <span className="text-foreground">{d}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 3: FINAL VERDICT */}
              {currentStep === "complete" && verdict && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                      <span className="text-background font-mono text-xs">3</span>
                    </div>
                    <h3 className="font-mono text-sm tracking-[0.15em] uppercase">VERDICT — Risk Assessment</h3>
                    <span className="font-mono text-xs text-green-500 ml-auto">COMPLETE</span>
                  </div>

                  <div className={`border ${getRiskBgColor(verdict.risk_level)} p-8`}>
                    <div className="mb-8">
                      <div
                        className={`text-6xl md:text-8xl font-serif tracking-tight ${getRiskColor(verdict.risk_level)}`}
                        style={{ WebkitTextStroke: "1px currentColor", WebkitTextFillColor: "transparent" }}
                      >
                        {verdict.risk_level}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground mt-2">
                        {Math.round(verdict.confidence * 100)}% confidence
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-2">RECOMMENDATION</div>
                      <p className="font-serif text-lg leading-relaxed">{verdict.recommendation}</p>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                      <button onClick={() => onNavigate("map")} className="flex-1 px-6 py-4 border border-foreground font-mono text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all">
                        View on Territory Map
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}