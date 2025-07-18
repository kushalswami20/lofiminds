// components/JournalAssistant.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles, Heart } from "lucide-react";

// Ensure these component imports match your project's structure (e.g., shadcn/ui)
// If you don't have these, you'll need to create them or adapt to your UI library.

interface JournalAssistantProps {
  mood: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function JournalAssistant({ mood }: JournalAssistantProps) {
  const [journalEntry, setJournalEntry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Define prompts for different moods
  const moodPrompts: Record<string, string> = {
    happy: "What's bringing you joy today? Share your positive moments! ✨",
    sad: "It's okay to feel sad. What's on your heart right now? 💙",
    angry: "Feeling frustrated? Let it out here - this is your safe space. 🔥",
    anxious: "Take a deep breath. What's making you feel anxious? Let's work through it together. 🌸",
    tired: "You seem exhausted. What's been draining your energy lately? 😴",
    neutral: "How has your day been? Share whatever comes to mind. 🌿",
  };

  // Scroll to the bottom of the chat window whenever new messages are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a journal entry to the backend API
  const handleSend = async () => {
    const trimmed = journalEntry.trim();
    if (!trimmed) return; // Don't send empty messages

    // Add user's message to the chat display immediately
    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setJournalEntry(""); // Clear the input field
    setIsLoading(true); // Show loading indicator

    try {
      // Send the journal entry and mood to your Next.js API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed, // The user's journal entry
          mood,          // The user's selected mood
        }),
      });

      // Check if the HTTP response was successful
      if (!response.ok) {
        // Attempt to parse error message from server response
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      // Parse the successful JSON response from the backend
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          data.reply || // Use the AI's reply, or a fallback message
          "I'm here to listen. Sometimes just writing down your thoughts can be healing. Take a deep breath - you're doing great. 💙",
      };
      setMessages((prev) => [...prev, assistantMessage]); // Add AI's message to display
    } catch (error: any) { // Catch any errors during the fetch or JSON parsing
      console.error("Error sending journal entry to API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `Oops! There was an issue processing your entry: ${error.message || 'Please check your internet connection and try again.'}`,
        },
      ]);
    } finally {
      setIsLoading(false); // Hide loading indicator regardless of success or failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4"> {/* Added padding for better mobile view */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Journal Assistant</h1>
        <p className="text-white/90">Express yourself freely - I'm here to listen and support you</p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg"> {/* Added shadow */}
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Your Journal Chat</span>
          </CardTitle>
          <p className="text-sm text-gray-600">{moodPrompts[mood] || moodPrompts.neutral}</p>
        </CardHeader>
        <CardContent>
          {/* Chat display area */}
          <div className="h-72 overflow-y-auto space-y-4 mb-4 bg-white/40 rounded-lg p-4 shadow-inner border border-white/20">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center py-10">No conversation yet. Start by sharing your thoughts.</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                // Align messages based on role (user on right, assistant on left)
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-2 mb-2 max-w-[75%] break-words text-right shadow-md" // Adjusted max-width, added break-words
                      : "bg-blue-50 text-blue-900 rounded-lg px-4 py-2 mb-2 max-w-[75%] break-words shadow-md" // Adjusted max-width, added break-words
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} /> {/* Reference for auto-scrolling */}
          </div>

          {/* Input and Send button */}
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Start writing... Remember, this is a judgment-free zone."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="min-h-12 resize-none border-gray-300 focus:border-purple-400 focus:ring-purple-400 flex-1 rounded-lg" // Improved styling
              onKeyDown={(e) => {
                // Send message on Enter key press (without Shift)
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading} // Disable input while loading
            />
            <Button
              onClick={handleSend}
              disabled={!journalEntry.trim() || isLoading} // Disable button if empty or loading
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-5 py-3 rounded-lg text-white font-semibold shadow-md" // Enhanced button styling
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Thinking..</span>
                </div>
              ) : (
                <Send className="w-4 h-4" /> // Send icon
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inspirational Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-sm transition-transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🌱</div>
            <h3 className="font-semibold mb-1 text-gray-800">Growth Mindset</h3>
            <p className="text-sm text-gray-600">Every challenge is an opportunity to grow</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-sm transition-transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🤗</div>
            <h3 className="font-semibold mb-1 text-gray-800">Self-Compassion</h3>
            <p className="text-sm text-gray-600">Be kind to yourself, you're doing your best</p>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-sm transition-transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold mb-1 text-gray-800">Present Moment</h3>
            <p className="text-sm text-gray-600">Focus on what you can control right now</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}