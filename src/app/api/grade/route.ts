import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function POST(request: Request) {
  // 1. รับข้อมูลจากหน้าบ้าน
  const { word, userSentence } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ แก้ชื่อโมเดลตรงนี้เป็น gemini-pro (เพื่อให้เหมือนไฟล์แรก)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Act as an IELTS tutor.
    Target Word: "${word}"
    User Sentence: "${userSentence}"
    
    Strictly return ONLY a JSON object (no markdown).
    Format:
    {
      "score": number (0-10),
      "feedback": "string (corrected sentence)",
      "reasoning": "string (explanation)"
    }`;

    console.log("🔄 Grading with Gemini Pro...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // ล้างพวก ```json ที่มันชอบแถมมา
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    console.log("✅ Grade Result:", text);

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error) {
    console.error("❌ Grade Error:", error);
    // ส่งค่า Error กลับไป กันหน้าเว็บค้าง
    return NextResponse.json({ 
        score: 0, 
        feedback: "System Error: AI model not found.", 
        reasoning: "Please check server terminal logs." 
    });
  }
}