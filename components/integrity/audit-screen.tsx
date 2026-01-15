"use client"

import { useState, useEffect, useCallback } from "react"
import type { Screen, ProjectRecord, AuditVerdict } from "@/lib/types"

interface AuditScreenProps {
  onNavigate: (screen: Screen) => void
  projectRecord?: ProjectRecord | null
}

type AuditStep = "idle" | "retrieve" | "audit" | "verdict" | "complete"

const mockProjectData: ProjectRecord = {
  project_id: "MH-2024-PWD-01847",
  title: "Kurla-Andheri Connector Road Resurfacing",
  budget: "₹4,27,50,000",
  contractor: "Desai Infrastructure Ltd.",
  status: "Completed (claimed)",
  completion_date: "2024-11-15",
  sanctioned_by: "Municipal Corporation of Greater Mumbai",
}

const mockVerdict: AuditVerdict = {
  risk_level: "HIGH",
  confidence: 0.89,
  discrepancies: [
    "Completion claimed 45 days before final inspection date",
    "Evidence timestamp predates claimed completion by 12 days",
    "Surface quality variance: -67% from specification standard",
    "Material grade inconsistent with sanctioned tender documents",
  ],
  recommendation: "Immediate physical audit recommended. Refer to Municipal Vigilance Department for investigation.",
}

export function AuditScreen({ onNavigate, projectRecord }: AuditScreenProps) {
  const [currentStep, setCurrentStep] = useState<AuditStep>("idle")
  const [showVerdict, setShowVerdict] = useState(false)
  const [retrieveProgress, setRetrieveProgress] = useState(0)
  const [auditProgress, setAuditProgress] = useState(0)

  const record = projectRecord || mockProjectData

  const startAudit = useCallback(() => {
    setCurrentStep("retrieve")
  }, [])

  // Step 1: RETRIEVE - Document reconstruction
  useEffect(() => {
    if (currentStep !== "retrieve") return

    const interval = setInterval(() => {
      setRetrieveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setCurrentStep("audit"), 500)
          return 100
        }
        return prev + 4
      })
    }, 40)

    return () => clearInterval(interval)
  }, [currentStep])

  // Step 2: AUDIT - Comparison analysis
  useEffect(() => {
    if (currentStep !== "audit") return

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setCurrentStep("verdict"), 500)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [currentStep])

  // Step 3: VERDICT - Full screen reveal
  useEffect(() => {
    if (currentStep !== "verdict") return

    const timer = setTimeout(() => {
      setShowVerdict(true)
      setTimeout(() => setCurrentStep("complete"), 2500)
    }, 200)

    return () => clearTimeout(timer)
  }, [currentStep])

  const getRiskColor = (level: string) => {
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
        return "text-foreground"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-destructive/10 border-destructive"
      case "HIGH":
        return "bg-destructive/10 border-destructive"
      case "MEDIUM":
        return "bg-caution/10 border-caution"
      case "LOW":
        return "bg-accent/10 border-accent"
      default:
        return "bg-secondary border-border"
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 relative">
      {/* Verdict overlay - full screen takeover */}
      {currentStep === "verdict" && showVerdict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground">
          <div className="text-center horizontal-wipe">
            <div className={`text-8xl md:text-9xl font-serif tracking-tight ${getRiskColor(mockVerdict.risk_level)}`}>
              {mockVerdict.risk_level}
            </div>
            <div className="mt-4 font-mono text-sm text-background/60 tracking-widest">
              RISK ASSESSMENT COMPLETE — {Math.round(mockVerdict.confidence * 100)}% CONFIDENCE
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-6">
        <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">VERIFICATION CHAMBER</h1>
      </div>

      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Left - Vertical Timeline (10% width) */}
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
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`
                      absolute top-0 w-px h-full -translate-y-1/2
                      transition-all duration-500
                      ${isActive ? "bg-foreground" : "bg-border"}
                    `}
                  />
                )}

                {/* Step indicator */}
                <div
                  className={`
                    relative z-10 w-8 h-8 flex items-center justify-center
                    transition-all duration-200
                    ${isCurrent ? "border-2 border-foreground bg-foreground" : isActive ? "border border-foreground bg-foreground" : "border border-border bg-background"}
                  `}
                >
                  <span
                    className={`
                    font-mono text-xs
                    ${isCurrent || isActive ? "text-background" : "text-muted-foreground"}
                  `}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Step label */}
                <span
                  className={`
                    font-mono text-[8px] md:text-[10px] tracking-widest mt-2
                    writing-mode-vertical md:writing-mode-horizontal
                    ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                  `}
                  style={{ writingMode: "vertical-rl" }}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Main Panel (90% width) */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          {/* Idle state - Start audit */}
          {currentStep === "idle" && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center max-w-lg">
                <h2 className="font-serif text-3xl md:text-4xl mb-6">Initiate Verification</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8 leading-relaxed">
                  The AI audit system will analyze submitted documents against field evidence to detect discrepancies
                  and assess project integrity risk.
                </p>

                {/* Project summary */}
                <div className="border border-border p-6 mb-8 text-left">
                  <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4">TARGET PROJECT</div>
                  <div className="font-serif text-lg mb-2">{record.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">{record.project_id}</div>
                </div>

                <button
                  onClick={startAudit}
                  className="
                    px-8 py-4 
                    border-2 border-foreground 
                    font-mono text-sm tracking-[0.2em] uppercase
                    hover:bg-foreground hover:text-background
                    transition-all duration-200
                  "
                >
                  Begin Automated Audit
                </button>
              </div>
            </div>
          )}

          {/* Step 1: RETRIEVE */}
          {(currentStep === "retrieve" ||
            currentStep === "audit" ||
            currentStep === "verdict" ||
            currentStep === "complete") && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                  <span className="text-background font-mono text-xs">1</span>
                </div>
                <h3 className="font-mono text-sm tracking-[0.15em] uppercase">RETRIEVE — Document Reconstruction</h3>
                {currentStep !== "retrieve" && <span className="font-mono text-xs text-accent ml-auto">COMPLETE</span>}
              </div>

              <div className={`border border-border p-6 ${currentStep === "retrieve" ? "horizontal-wipe" : ""}`}>
                {currentStep === "retrieve" && (
                  <div className="mb-4">
                    <div className="h-1 bg-border">
                      <div
                        className="h-full bg-foreground transition-all duration-100"
                        style={{ width: `${retrieveProgress}%` }}
                      />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mt-2">
                      SCANNING DOCUMENT... {retrieveProgress}%
                    </p>
                  </div>
                )}

                {/* OCR-style data blocks */}
                <div className="font-mono text-xs space-y-2 bg-secondary/50 p-4">
                  {Object.entries(record).map(([key, value], index) => {
                    const isVisible =
                      currentStep !== "retrieve" ||
                      index <= Math.floor((retrieveProgress / 100) * Object.keys(record).length)
                    if (typeof value === "object") return null
                    return (
                      <div
                        key={key}
                        className={`flex justify-between ${isVisible ? "typewriter-reveal" : "opacity-0"}`}
                      >
                        <span className="text-muted-foreground uppercase">{key.replace(/_/g, "_")}</span>
                        <span className="text-foreground">{value as string}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: AUDIT */}
          {(currentStep === "audit" || currentStep === "verdict" || currentStep === "complete") && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                  <span className="text-background font-mono text-xs">2</span>
                </div>
                <h3 className="font-mono text-sm tracking-[0.15em] uppercase">AUDIT — Comparative Analysis</h3>
                {currentStep !== "audit" && <span className="font-mono text-xs text-accent ml-auto">COMPLETE</span>}
              </div>

              <div className={`border border-border ${currentStep === "audit" ? "horizontal-wipe" : ""}`}>
                {currentStep === "audit" && (
                  <div className="p-4 border-b border-border">
                    <div className="h-1 bg-border">
                      <div
                        className="h-full bg-foreground transition-all duration-100"
                        style={{ width: `${auditProgress}%` }}
                      />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mt-2">
                      ANALYZING DISCREPANCIES... {auditProgress}%
                    </p>
                  </div>
                )}

                {/* Split screen comparison */}
                <div className="grid md:grid-cols-2">
                  {/* Official Record */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                    <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <span>■</span> OFFICIAL RECORD
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">STATUS</span>
                        <span className="font-mono text-sm">{record.status}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">COMPLETION</span>
                        <span className="font-mono text-sm">{record.completion_date}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">BUDGET</span>
                        <span className="font-mono text-sm">{record.budget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Field Evidence */}
                  <div className="p-6">
                    <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <span>◇</span> FIELD EVIDENCE
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">OBSERVED STATUS</span>
                        <span className="font-mono text-sm text-destructive">Incomplete — 40% surface coverage</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">EVIDENCE DATE</span>
                        <span className="font-mono text-sm text-caution">2024-11-03 (12 days before claim)</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">ESTIMATED VALUE</span>
                        <span className="font-mono text-sm text-destructive">₹1,41,00,000 (33% of budget)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discrepancy markers with line connectors */}
                <div className="border-t border-border p-6 bg-destructive/5">
                  <div className="font-mono text-[10px] tracking-wider text-destructive mb-4">
                    ▲ {mockVerdict.discrepancies.length} DISCREPANCIES DETECTED
                  </div>
                  <div className="space-y-2">
                    {mockVerdict.discrepancies.map((d, i) => (
                      <div key={i} className="flex items-start gap-3 font-mono text-xs">
                        <span className="text-destructive">—</span>
                        <span className="text-muted-foreground">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: VERDICT */}
          {currentStep === "complete" && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 border border-foreground bg-foreground flex items-center justify-center">
                  <span className="text-background font-mono text-xs">3</span>
                </div>
                <h3 className="font-mono text-sm tracking-[0.15em] uppercase">VERDICT — Risk Assessment</h3>
                <span className="font-mono text-xs text-accent ml-auto">COMPLETE</span>
              </div>

              <div className={`border ${getRiskBgColor(mockVerdict.risk_level)} p-8`}>
                {/* Large outlined risk level */}
                <div className="mb-8">
                  <div
                    className={`text-6xl md:text-8xl font-serif tracking-tight ${getRiskColor(mockVerdict.risk_level)}`}
                    style={{
                      WebkitTextStroke: "1px currentColor",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {mockVerdict.risk_level}
                  </div>
                  <div className="font-mono text-sm text-muted-foreground mt-2">
                    {Math.round(mockVerdict.confidence * 100)}% confidence
                  </div>
                </div>

                {/* Reasoning in structured paragraphs with line numbers - legal brief style */}
                <div className="border-t border-border pt-6">
                  <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-4">
                    ASSESSMENT REASONING
                  </div>
                  <div className="font-mono text-xs space-y-4">
                    {mockVerdict.discrepancies.map((d, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-muted-foreground/50 w-6 text-right">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-relaxed">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="font-mono text-[10px] tracking-wider text-muted-foreground mb-2">RECOMMENDATION</div>
                  <p className="font-serif text-lg leading-relaxed">{mockVerdict.recommendation}</p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => onNavigate("map")}
                    className="
                      flex-1 px-6 py-4 
                      border border-foreground 
                      font-mono text-xs tracking-[0.15em] uppercase
                      hover:bg-foreground hover:text-background
                      transition-all duration-200
                    "
                  >
                    View on Territory Map
                  </button>
                  <button
                    className="
                      flex-1 px-6 py-4 
                      border border-destructive text-destructive
                      font-mono text-xs tracking-[0.15em] uppercase
                      hover:bg-destructive hover:text-background
                      transition-all duration-200
                    "
                  >
                    File Official Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
