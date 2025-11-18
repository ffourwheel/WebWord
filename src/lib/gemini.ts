import { GoogleGenerativeAI } from "@google/generative-ai";

// ตรวจสอบว่ามี Key หรือไม่ (ป้องกัน Error)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Missing GEMINI_API_KEY in .env.local");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");