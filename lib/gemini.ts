import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";

let cached: GoogleGenerativeAI | null = null;

export function getGemini(): GoogleGenerativeAI {
  if (!cached) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY missing");
    cached = new GoogleGenerativeAI(key);
  }
  return cached;
}

export const FLASH_MODEL = "gemini-2.5-flash";

export const ENHANCE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    enhanced: { type: SchemaType.STRING },
    detectedTaskType: { type: SchemaType.STRING },
    changes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          added: { type: SchemaType.STRING },
          why: { type: SchemaType.STRING },
        },
        required: ["added", "why"],
      },
    },
  },
  required: ["enhanced", "detectedTaskType", "changes"],
};
