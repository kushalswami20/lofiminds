// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize GoogleGenerativeAI
// It's crucial to use environment variables for API keys in production.
// Set this in your .env.local file: GOOGLE_API_KEY="AIzaSy...your-key-here"
const GOOGLE_API_KEY="AIzaSyBIJrTXUsKHrBdPmYUSrJcF1IHtpoEfoDg";
console.log("Loading API Key:", process.env.GOOGLE_API_KEY ? "Key found" : "Key NOT found");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
export async function POST(req: NextRequest) {
  // Log the incoming request for debugging purposes
  console.log(`[API] Received ${req.method} request to ${req.url}`);

  try {
    const body = await req.json();
    const { text, mood } = body;

    // Validate the incoming request body
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.error('[API Error] Validation: Journal entry text is missing or invalid.');
      return NextResponse.json(
        { error: 'Journal entry text is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Default mood to 'neutral' if not provided
    const currentMood = mood && typeof mood === 'string' ? mood : 'neutral';

    // Get the generative model (e.g., 'gemini-pro' for text-only)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' }); // Or 'gemini-1.5-pro-latest' etc.

    // Construct the prompt for the Gemini model.
    // Gemini's prompt structure is slightly different; you typically pass a single string or an array of parts.
    // For a chat-like interaction, you'd use chat sessions, but for a single-turn reflection,
    // a strong single prompt is effective.
    const prompt = `You are a compassionate and empathetic AI journal assistant. Your primary goal is to provide supportive, reflective, and encouraging responses to the user's journal entries. Acknowledge their feelings based on their stated mood (${currentMood}) and the content of their entry. Keep your responses concise (2-4 sentences) and focus on validating their experience, offering gentle encouragement, or prompting further self-reflection. Avoid giving direct advice, medical opinions, or making definitive statements about their mental state. Use a warm and understanding tone.

User's current mood: ${currentMood}
User's journal entry: "${text}"

Please provide your supportive response.`;

    console.log('[API] Sending request to Gemini API...');

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const assistantReply = response.text().trim(); // Get the text content from the Gemini response

    if (!assistantReply) {
      console.warn('[API Warning] Gemini returned an empty reply for:', text);
      return NextResponse.json(
        { reply: "I'm here to listen. Sometimes just writing down your thoughts can be healing. Take a deep breath - you're doing great. 💙", error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    console.log('[API] Gemini response received:', assistantReply);
    // Send the AI's reply back to the frontend
    return NextResponse.json({ reply: assistantReply });

  } catch (error: any) {
    // Centralized error handling for Gemini API errors and other exceptions
    console.error("[API Error] An error occurred:", error);

    // Google Generative AI errors often have specific structures.
    // The library's errors might include a 'response' property with API details.
    let errorMessage = "An unexpected server error occurred. Please try again.";
    if (error.message) {
      errorMessage = `AI service error: ${error.message}`;
    }
    // You might want to parse error.response.data for more specific details if available
    // from the GoogleGenerativeAI library's error object.

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}