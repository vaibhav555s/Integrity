"use client"

import { useState } from "react"
import type { Screen, ProjectRecord, EvidenceMetadata } from "@/lib/types"
import { Logo } from "@/components/integrity/logo"
import { Navigation } from "@/components/integrity/navigation"
import { LandingScreen } from "@/components/integrity/landing-screen"
import { DocumentScreen } from "@/components/integrity/document-screen"
import { EvidenceScreen } from "@/components/integrity/evidence-screen"
import { AuditScreen } from "@/components/integrity/audit-screen"
import { MapScreen } from "@/components/integrity/map-screen"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [extractedRecord, setExtractedRecord] = useState<ProjectRecord | null>(null)
  const [evidenceData, setEvidenceData] = useState<{ metadata: EvidenceMetadata; issues: string[] } | null>(null)

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleDocumentExtracted = (record: ProjectRecord) => {
    setExtractedRecord(record)
  }

  const handleEvidenceSubmitted = (metadata: EvidenceMetadata, issues: string[]) => {
    setEvidenceData({ metadata, issues })
  }

  return (
    <main className="relative">
      <Logo onNavigate={handleNavigate} />
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />

      {currentScreen === "landing" && <LandingScreen onNavigate={handleNavigate} />}

      {currentScreen === "document" && (
        <DocumentScreen onNavigate={handleNavigate} onDocumentExtracted={handleDocumentExtracted} />
      )}

      {currentScreen === "evidence" && (
        <EvidenceScreen onNavigate={handleNavigate} onEvidenceSubmitted={handleEvidenceSubmitted} />
      )}

      {currentScreen === "audit" && <AuditScreen onNavigate={handleNavigate} projectRecord={extractedRecord} />}

      {currentScreen === "map" && <MapScreen onNavigate={handleNavigate} />}
    </main>
  )
}
