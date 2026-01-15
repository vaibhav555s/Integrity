// src/lib/audit-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ProjectRecord, AuditVerdict } from "@/lib/types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function generateAuditVerdict(
  record: ProjectRecord,
  evidenceImage: string // Base64 string
): Promise<AuditVerdict> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Clean base64 string (remove data:image/jpeg;base64, prefix)
    const imageParts = evidenceImage.split(",");
    const base64Data = imageParts[1] || imageParts[0];

    const prompt = `
      Act as a Government Civil Infrastructure Auditor. 
      
      I will provide:
      1. OFFICIAL RECORD (JSON): Claims what *should* be there (budget, status, completion date).
      2. FIELD EVIDENCE (Image): A photo taken at the site today.

      Your Task:
      Compare the Record vs. The Image. 
      - If Record says "Completed" but Image shows construction/potholes -> HIGH RISK.
      - If Record says "In Progress" and Image shows work -> LOW RISK.
      
      Official Record: ${JSON.stringify(record)}

      Return a JSON object strictly matching this schema:
      {
        "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "confidence": number (0.0 to 1.0),
        "discrepancies": ["string", "string"], (List specific visual contradictions)
        "recommendation": "string" (Professional next steps)
      }
      
      Return ONLY raw JSON. No markdown.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Audit AI Failed:", error);
    // Fallback if AI fails
    return {
      risk_level: "MEDIUM",
      confidence: 0.5,
      discrepancies: ["AI Analysis Failed - Manual Review Required"],
      recommendation: "System error during audit. Proceed with manual inspection.",
    };
  }
}