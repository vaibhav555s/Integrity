import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. REMOVE "import process from 'process'" - it breaks the browser build.

// 2. Initialize AI using Vite's way of accessing env variables
// Ensure your .env file has: VITE_GEMINI_API_KEY=your_key_here

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function extractDocumentData(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    // 3. Prepare file for Gemini (Client-side logic)
    const base64Data = await fileToGenerativePart(file);

    // 4. The Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Analyze this government infrastructure document. Extract these exact fields into a JSON object:
      - project_id (e.g., MH-2024-PWD-...)
      - title
      - budget (keep currency symbol)
      - contractor
      - status
      - completion_date (YYYY-MM-DD)
      - sanctioned_by
      - location_address (The physical address mentioned)
      
      If a field is not found, use "Not Mentioned". 
      Return ONLY raw JSON. Do not use Markdown code blocks.
    `;

    // 5. Call Gemini
    const result = await model.generateContent([prompt, base64Data]);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

// Helper function to convert File to Base64
async function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  );
}