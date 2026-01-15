// Project INTEGRITY - Type Definitions

export interface ProjectRecord {
  project_id: string
  title: string
  budget: string
  contractor: string
  status: string
  completion_date: string
  sanctioned_by: string
  location?: {
    lat: number
    lng: number
    address: string
  }
}

export interface AuditVerdict {
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  confidence: number
  discrepancies: string[]
  recommendation: string
}

export interface EvidenceMetadata {
  timestamp: string
  coordinates: {
    lat: number
    lng: number
  }
  weather: string
  lighting: string
}

export interface IssueCategory {
  id: string
  label: string
  icon: string
}

export type Screen = "landing" | "document" | "evidence" | "audit" | "map"
