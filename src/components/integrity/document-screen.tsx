"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import type { ProjectRecord, Screen } from "@/lib/types"

interface DocumentScreenProps {
  onNavigate: (screen: Screen) => void
  onDocumentExtracted: (record: ProjectRecord) => void
}

// Mock extraction simulation
const mockExtractedData: ProjectRecord = {
  project_id: "MH-2024-PWD-01847",
  title: "Kurla-Andheri Connector Road Resurfacing",
  budget: "₹4,27,50,000",
  contractor: "Desai Infrastructure Ltd.",
  status: "Completed (claimed)",
  completion_date: "2024-11-15",
  sanctioned_by: "Municipal Corporation of Greater Mumbai",
  location: {
    lat: 19.076,
    lng: 72.8777,
    address: "Kurla West, Mumbai, Maharashtra",
  },
}

export function DocumentScreen({ onNavigate, onDocumentExtracted }: DocumentScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ProjectRecord | null>(null)
  const [extractionStep, setExtractionStep] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const simulateUpload = useCallback(() => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsExtracting(true)
          return 100
        }
        return prev + 5
      })
    }, 50)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      simulateUpload()
    },
    [simulateUpload],
  )

  const handleFileSelect = useCallback(() => {
    simulateUpload()
  }, [simulateUpload])

  // Simulated extraction with typewriter effect
  useEffect(() => {
    if (!isExtracting) return

    const fields = Object.keys(mockExtractedData)
    let currentField = 0

    const extractInterval = setInterval(() => {
      if (currentField >= fields.length) {
        clearInterval(extractInterval)
        setIsExtracting(false)
        setExtractedData(mockExtractedData)
        onDocumentExtracted(mockExtractedData)
        return
      }
      setExtractionStep(currentField + 1)
      currentField++
    }, 300)

    return () => clearInterval(extractInterval)
  }, [isExtracting, onDocumentExtracted])

  const dataFields = extractedData
    ? [
        { label: "PROJECT_ID", value: extractedData.project_id },
        { label: "TITLE", value: extractedData.title },
        { label: "BUDGET", value: extractedData.budget },
        { label: "CONTRACTOR", value: extractedData.contractor },
        { label: "STATUS", value: extractedData.status },
        { label: "COMPLETION_DATE", value: extractedData.completion_date },
        { label: "SANCTIONED_BY", value: extractedData.sanctioned_by },
      ]
    : []

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-6">
        <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">OFFICIAL RECORD INTAKE</h1>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Left - Upload Zone (full bleed, monochrome) */}
        <div className="w-full lg:w-1/2 bg-secondary border-b lg:border-b-0 lg:border-r border-border p-6 md:p-12">
          <div className="h-full flex flex-col">
            {/* Scanner bed aesthetic */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileSelect}
              className={`
                flex-1 min-h-[300px] lg:min-h-0
                border-2 cursor-pointer
                transition-all duration-200
                flex flex-col items-center justify-center
                ${isDragging ? "border-accent bg-accent/5" : "border-foreground/20 hover:border-foreground/40"}
                ${isUploading || extractedData ? "pointer-events-none" : ""}
              `}
            >
              {!isUploading && !extractedData && (
                <>
                  {/* Scanner grid overlay */}
                  <div
                    className="absolute inset-4 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px",
                    }}
                  />

                  <div className="text-center relative z-10">
                    {/* Custom geometric upload icon */}
                    <div className="w-16 h-16 mx-auto mb-6 border border-foreground/30 flex items-center justify-center">
                      <div className="w-8 h-1 bg-foreground/30" />
                      <div className="absolute w-1 h-8 bg-foreground/30" />
                    </div>

                    <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      DROP DOCUMENT HERE
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/60">
                      PDF, JPEG, PNG — OFFICIAL RECORDS ONLY
                    </p>
                  </div>
                </>
              )}

              {isUploading && (
                <div className="w-full max-w-md px-8">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
                    SCANNING DOCUMENT
                  </p>
                  {/* Linear progress bar - no circular spinner */}
                  <div className="h-1 bg-border w-full">
                    <div
                      className="h-full bg-foreground transition-all duration-100"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 text-center">{uploadProgress}%</p>
                </div>
              )}

              {extractedData && (
                <div className="text-center">
                  {/* Success checkmark - inline */}
                  <div className="w-12 h-12 mx-auto mb-4 border border-accent flex items-center justify-center">
                    <span className="text-accent text-xl">■</span>
                  </div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent">DOCUMENT PROCESSED</p>
                </div>
              )}
            </div>

            {/* File info footer */}
            {extractedData && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="font-mono text-[10px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>FILENAME</span>
                    <span>PWD_2024_01847_COMPLETION.pdf</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SIZE</span>
                    <span>2.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PROCESSED</span>
                    <span>{new Date().toISOString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Extraction Preview */}
        <div className="w-full lg:w-1/2 p-6 md:p-12 bg-background">
          <div className="mb-6">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">EXTRACTED DATA</h2>
            {isExtracting && (
              <p className="font-mono text-[10px] text-accent">PROCESSING {extractionStep}/7 FIELDS...</p>
            )}
          </div>

          {/* Table-like structure with monospace fonts */}
          <div className="border border-border">
            {/* Header row */}
            <div className="grid grid-cols-[140px_1fr] border-b border-border bg-secondary">
              <div className="p-3 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground border-r border-border">
                FIELD
              </div>
              <div className="p-3 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">VALUE</div>
            </div>

            {/* Data rows with typewriter reveal */}
            {["PROJECT_ID", "TITLE", "BUDGET", "CONTRACTOR", "STATUS", "COMPLETION_DATE", "SANCTIONED_BY"].map(
              (field, index) => {
                const fieldData = dataFields.find((d) => d.label === field)
                const isRevealed = extractionStep > index || extractedData

                return (
                  <div
                    key={field}
                    className={`
                    grid grid-cols-[140px_1fr] border-b border-border last:border-b-0
                    ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}
                  `}
                  >
                    <div className="p-3 font-mono text-[10px] tracking-wider text-muted-foreground border-r border-border">
                      {field}
                    </div>
                    <div className="p-3 font-mono text-xs">
                      {isRevealed && fieldData ? (
                        <span className="typewriter-reveal inline-block">{fieldData.value}</span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </div>
                  </div>
                )
              },
            )}
          </div>

          {/* Action buttons */}
          {extractedData && (
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => onNavigate("evidence")}
                className="
                  w-full px-6 py-4 
                  border border-foreground 
                  font-mono text-xs tracking-[0.15em] uppercase
                  hover:bg-foreground hover:text-background
                  transition-all duration-200
                "
              >
                Proceed to Evidence Upload
              </button>
              <button
                onClick={() => onNavigate("audit")}
                className="
                  w-full px-6 py-4 
                  border border-accent text-accent
                  font-mono text-xs tracking-[0.15em] uppercase
                  hover:bg-accent hover:text-background
                  transition-all duration-200
                "
              >
                Skip to Audit Chamber
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
