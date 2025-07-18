"use client"

import { Button } from "@/components/ui/button"

interface MoodSelectorProps {
  currentMood: string
  onMoodChange: (mood: string) => void
}

export function MoodSelector({ currentMood, onMoodChange }: MoodSelectorProps) {
  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
    { id: "sad", emoji: "😔", label: "Sad", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
    { id: "angry", emoji: "😠", label: "Angry", color: "bg-red-100 hover:bg-red-200 border-red-300" },
    { id: "anxious", emoji: "😰", label: "Anxious", color: "bg-purple-100 hover:bg-purple-200 border-purple-300" },
    { id: "tired", emoji: "😴", label: "Tired", color: "bg-gray-100 hover:bg-gray-200 border-gray-300" },
    { id: "neutral", emoji: "😌", label: "Calm", color: "bg-green-100 hover:bg-green-200 border-green-300" },
  ]

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-semibold mb-4 text-center">How are you feeling today?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            className={`
              flex flex-col items-center space-y-2 h-20 border-2 transition-all
              ${mood.color}
              ${currentMood === mood.id ? "ring-2 ring-offset-2 ring-blue-500 scale-105" : ""}
            `}
            variant="outline"
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </Button>
        ))}
      </div>
      {currentMood !== "neutral" && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            I see you're feeling {moods.find((m) => m.id === currentMood)?.label.toLowerCase()}. Let's find some tools
            to help you feel better. 💙
          </p>
        </div>
      )}
    </div>
  )
}
