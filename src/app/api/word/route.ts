import { NextResponse } from 'next/server';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ แก้จุดที่ Error: เปลี่ยนจาก "gemini-1.5-flash" เป็น "gemini-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 1 random English word (Level B1-C1). 
    Strictly return ONLY a JSON object (do not use Markdown code blocks).
    Format:
    {
      "word": "String",
      "partOfSpeech": "String",
      "level": "String",
      "meaning": "String",
      "example": "String",
      "imageUrl": "https://placehold.co/400"
    }`;

    console.log("🔄 Calling Gemini Pro...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // ล้างตัวอักษรขยะที่ Gemini Pro ชอบแถมมา
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    console.log("✅ Gemini Response:", text);

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("❌ Gemini Error:", error);
    
    // Fallback Data (กันเว็บพังถ้า API รวนอีก)
    return NextResponse.json({
       word: "Resilience",
       partOfSpeech: "Noun", 
       level: "Intermediate",
       meaning: "The capacity to recover quickly from difficulties.",
       example: "Her resilience helped her recover from the setback.",
       imageUrl: "https://placehold.co/400?text=Resilience"
    });
  }
}