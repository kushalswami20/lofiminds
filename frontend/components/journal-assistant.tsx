"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";

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

  const moodPrompts: Record<string, string> = {
    happy: "What's bringing you joy today? Share your positive moments! ✨",
    sad: "It's okay to feel sad. What's on your heart right now? 💙",
    angry: "Feeling frustrated? Let it out here - this is your safe space. 🔥",
    anxious: "Take a deep breath. What's making you feel anxious? Let's work through it together. 🌸",
    tired: "You seem exhausted. What's been draining your energy lately? 😴",
    neutral: "How has your day been? Share whatever comes to mind. 🌿",
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = journalEntry.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setJournalEntry("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, mood }),
      });

      const data = await res.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply || "I'm here to listen. 🌿",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Something went wrong: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">AI Journal Assistant</h1>
        <p className="text-white/80">Express freely. I'm here to support you 💬</p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Your Journal</span>
          </CardTitle>
          <p className="text-sm text-gray-600">{moodPrompts[mood] || moodPrompts.neutral}</p>
        </CardHeader>

        <CardContent>
          <div className="h-72 overflow-y-auto bg-white/40 rounded-lg p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center py-10">No messages yet</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg max-w-[75%]"
                    : "bg-blue-50 text-blue-900 px-4 py-2 rounded-lg max-w-[75%]"
                }>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 mt-4">
            <Textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
              placeholder="What's on your mind?"
              className="flex-1 resize-none"
            />
            <Button onClick={handleSend} disabled={!journalEntry.trim() || isLoading}>
              {isLoading ? "Thinking..." : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
