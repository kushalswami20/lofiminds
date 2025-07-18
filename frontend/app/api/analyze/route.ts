import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Read from environment securely
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text, mood } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Or "gemini-2.5-pro" if you have quota
    });

    const prompt = `
You are a kind, empathetic AI assistant helping users reflect in their mental health journal.
User mood: ${mood}
User entry: ${text}
Respond in a warm tone with brief encouragement and gentle reflection. Avoid advice or clinical language.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return NextResponse.json(
      {
        error: "AI service unavailable. Please try again later.",
        reply: "I'm here for you, even when tech fails. Try again in a moment. 💙",
      },
      { status: 500 }
    );
  }
}
