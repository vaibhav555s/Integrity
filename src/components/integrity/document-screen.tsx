"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import type { ProjectRecord, Screen } from "@/lib/types"
import { extractDocumentData } from "@/lib/process-document"// Import the Server Action

interface DocumentScreenProps {
  onNavigate: (screen: Screen) => void
  onDocumentExtracted: (record: ProjectRecord) => void
}

export function DocumentScreen({ onNavigate, onDocumentExtracted }: DocumentScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<ProjectRecord | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  
  // Hidden input ref for click-to-upload
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // --- REAL AI PROCESSING LOGIC ---
  const processFile = async (file: File) => {
    setIsProcessing(true)
    setFileName(file.name)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      // Call the Server Action (Gemini)
      const data = await extractDocumentData(formData)

      if (data) {
        const record: ProjectRecord = {
          project_id: data.project_id || "UNKNOWN",
          title: data.title || "Untitled Project",
          budget: data.budget || "₹0",
          contractor: data.contractor || "Not Mentioned",
          status: data.status || "Unknown",
          completion_date: data.completion_date || "N/A",
          sanctioned_by: data.sanctioned_by || "Government Authority",
          location: {
            lat: 19.076, // Default fallback (Mumbai)
            lng: 72.8777,
            address: data.location_address || "Location not extracted",
          },
        }
        
        setExtractedData(record)
        onDocumentExtracted(record)
      } else {
        alert("Could not extract data. Please ensure the document is clear.")
      }
    } catch (error) {
      console.error("Processing failed", error)
      alert("Error processing document. Check your API key.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0])
    }
  }

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
        {/* Left - Upload Zone */}
        <div className="w-full lg:w-1/2 bg-secondary border-b lg:border-b-0 lg:border-r border-border p-6 md:p-12">
          <div className="h-full flex flex-col">
            
            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden" 
              accept="image/*,application/pdf"
            />

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
                ${isProcessing || extractedData ? "pointer-events-none" : ""}
              `}
            >
              {!isProcessing && !extractedData && (
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

              {isProcessing && (
                <div className="w-full max-w-md px-8">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 text-center animate-pulse">
                    ANALYZING WITH GEMINI...
                  </p>
                  {/* Indeterminate loading bar */}
                  <div className="h-1 bg-border w-full overflow-hidden relative">
                    <div className="h-full bg-accent absolute top-0 left-0 w-1/2 animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
              )}

              {extractedData && (
                <div className="text-center">
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
                    <span className="text-foreground">{fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS</span>
                    <span className="text-accent">VERIFIED RECORD</span>
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
          </div>

          {/* Table-like structure */}
          <div className="border border-border">
            <div className="grid grid-cols-[140px_1fr] border-b border-border bg-secondary">
              <div className="p-3 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground border-r border-border">
                FIELD
              </div>
              <div className="p-3 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">VALUE</div>
            </div>

            {/* Data rows */}
            {["PROJECT_ID", "TITLE", "BUDGET", "CONTRACTOR", "STATUS", "COMPLETION_DATE", "SANCTIONED_BY"].map(
              (field, index) => {
                const fieldData = dataFields.find((d) => d.label === field)
                
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
                    <div className="p-3 font-mono text-xs break-words">
                      {/* Check if data exists - removed the typewriter delay for instant feedback */}
                      {fieldData ? (
                        <span className="text-foreground">{fieldData.value}</span>
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