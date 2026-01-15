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
  
  // FIX 1: Update state to hold the image
  const [evidenceData, setEvidenceData] = useState<{ 
    metadata: EvidenceMetadata; 
    issues: string[]; 
    image: string | null // Added image here
  } | null>(null)

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleDocumentExtracted = (record: ProjectRecord) => {
    setExtractedRecord(record)
  }

  // FIX 2: Accept the 3rd argument (image) from EvidenceScreen
  const handleEvidenceSubmitted = (metadata: EvidenceMetadata, issues: string[], image: string) => {
    setEvidenceData({ metadata, issues, image })
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

      {currentScreen === "audit" && (
        <AuditScreen 
          onNavigate={handleNavigate} 
          projectRecord={extractedRecord}
          // FIX 3: Pass the image to AuditScreen
          evidenceImage={evidenceData?.image} 
        />
      )}

      {currentScreen === "map" && <MapScreen onNavigate={handleNavigate} />}
    </main>
  )
}