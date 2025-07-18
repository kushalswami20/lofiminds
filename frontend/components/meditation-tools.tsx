"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Heart, Zap, Timer, Play, Pause } from "lucide-react"

interface MeditationToolsProps {
  mood: string
}

export function MeditationTools({ mood }: MeditationToolsProps) {
  const [activeExercise, setActiveExercise] = useState(null)
  const [breathingCount, setBreathingCount] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState("inhale") // inhale, hold, exhale
  const [isBreathing, setIsBreathing] = useState(false)
  const [timer, setTimer] = useState(0)

  const moodAffirmations = {
    happy: [
      "I am radiating joy and positivity ✨",
      "My happiness is contagious and uplifts others 🌟",
      "I choose to see the beauty in every moment 🌸",
    ],
    sad: [
      "It's okay to feel sad, and I'm gentle with myself 💙",
      "This feeling will pass, and I am stronger than I know 🌈",
      "I allow myself to heal at my own pace 🌱",
    ],
    anxious: [
      "I am safe in this moment, and I can handle whatever comes 🛡️",
      "I breathe in calm and breathe out worry 🌊",
      "I trust in my ability to navigate challenges 💪",
    ],
    angry: [
      "I acknowledge my anger and choose peace 🕊️",
      "I have the power to respond with wisdom 🧠",
      "I release what I cannot control 🍃",
    ],
    tired: [
      "I give myself permission to rest and recharge 😴",
      "My body and mind deserve gentle care 🤗",
      "Rest is productive and necessary for my wellbeing 🌙",
    ],
    neutral: [
      "I am present and aware in this moment 🧘",
      "I am exactly where I need to be right now ✨",
      "I embrace the calm within me 🌿",
    ],
  }

  const quickCalmTechniques = [
    {
      id: "breathing",
      title: "4-7-8 Breathing",
      icon: Wind,
      description: "Inhale for 4, hold for 7, exhale for 8",
      color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
    },
    {
      id: "affirmation",
      title: "Positive Affirmations",
      icon: Heart,
      description: "Mood-based encouraging thoughts",
      color: "bg-pink-100 hover:bg-pink-200 border-pink-300",
    },
    {
      id: "quickcalm",
      title: "Quick Calm",
      icon: Zap,
      description: "2-minute instant relaxation",
      color: "bg-green-100 hover:bg-green-200 border-green-300",
    },
  ]

  useEffect(() => {
    let interval
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)

        // Breathing cycle: 4s inhale, 7s hold, 8s exhale
        const cycleTime = timer % 19
        if (cycleTime < 4) {
          setBreathingPhase("inhale")
        } else if (cycleTime < 11) {
          setBreathingPhase("hold")
        } else {
          setBreathingPhase("exhale")
        }

        if (cycleTime === 18) {
          setBreathingCount((prev) => prev + 1)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isBreathing, timer])

  const startBreathing = () => {
    setIsBreathing(true)
    setTimer(0)
    setBreathingCount(0)
    setActiveExercise("breathing")
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setTimer(0)
    setActiveExercise(null)
  }

  const renderBreathingExercise = () => (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="w-5 h-5 text-blue-600" />
          <span>4-7-8 Breathing Exercise</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="relative">
          <div
            className={`
            w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000
            ${
              breathingPhase === "inhale"
                ? "scale-110 border-blue-400 bg-blue-100"
                : breathingPhase === "hold"
                  ? "scale-110 border-purple-400 bg-purple-100"
                  : "scale-90 border-green-400 bg-green-100"
            }
          `}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-2xl font-bold capitalize">{breathingPhase}</div>
                <div className="text-sm text-gray-600">
                  {breathingPhase === "inhale" ? "4 sec" : breathingPhase === "hold" ? "7 sec" : "8 sec"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg">
            Cycles completed: <span className="font-bold">{breathingCount}</span>
          </p>
          <p className="text-sm text-gray-600">
            {breathingPhase === "inhale"
              ? "Breathe in slowly through your nose..."
              : breathingPhase === "hold"
                ? "Hold your breath gently..."
                : "Exhale slowly through your mouth..."}
          </p>
        </div>

        <Button
          onClick={isBreathing ? stopBreathing : startBreathing}
          className={`w-full ${isBreathing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isBreathing ? (
            <>
              <Pause className="w-4 h-4 mr-2" /> Stop Exercise
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> Start Breathing
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderAffirmations = () => (
    <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-600" />
          <span>Positive Affirmations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {moodAffirmations[mood].map((affirmation, index) => (
          <div key={index} className="p-4 bg-white/70 rounded-lg border border-pink-100">
            <p className="text-center text-gray-700 font-medium">{affirmation}</p>
          </div>
        ))}
        <Button onClick={() => setActiveExercise(null)} variant="outline" className="w-full">
          Back to Tools
        </Button>
      </CardContent>
    </Card>
  )

  const renderQuickCalm = () => (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-green-600" />
          <span>Quick Calm Technique</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌊</div>
          <h3 className="text-xl font-semibold">5-4-3-2-1 Grounding</h3>
          <div className="space-y-3 text-left">
            <p>
              <strong>5 things</strong> you can see around you
            </p>
            <p>
              <strong>4 things</strong> you can touch
            </p>
            <p>
              <strong>3 things</strong> you can hear
            </p>
            <p>
              <strong>2 things</strong> you can smell
            </p>
            <p>
              <strong>1 thing</strong> you can taste
            </p>
          </div>
          <p className="text-sm text-gray-600 italic">
            This technique helps bring you back to the present moment and reduces anxiety.
          </p>
        </div>
        <Button onClick={() => setActiveExercise(null)} variant="outline" className="w-full">
          Back to Tools
        </Button>
      </CardContent>
    </Card>
  )

  if (activeExercise === "breathing") return renderBreathingExercise()
  if (activeExercise === "affirmation") return renderAffirmations()
  if (activeExercise === "quickcalm") return renderQuickCalm()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quick Calm Tools</h1>
        <p className="text-white/90">Instant relaxation techniques for any moment</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {quickCalmTechniques.map((technique) => {
          const Icon = technique.icon
          return (
            <Card
              key={technique.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${technique.color}`}
              onClick={() => setActiveExercise(technique.id)}
            >
              <CardContent className="p-6 text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <h3 className="text-xl font-semibold mb-2">{technique.title}</h3>
                <p className="text-gray-600">{technique.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-purple-600" />
            <span>Wellness Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">When to Use These Tools:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Before important meetings or exams</li>
                <li>• When feeling overwhelmed</li>
                <li>• During study breaks</li>
                <li>• Before sleep for better rest</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Remember:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Consistency is more important than duration</li>
                <li>• It's normal for your mind to wander</li>
                <li>• Start with just 2-3 minutes daily</li>
                <li>• Be patient and kind with yourself</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
