"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Target, Brain, Waves, Moon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface GuidedMeditationProps {
  mood: string
}

export function GuidedMeditation({ mood }: GuidedMeditationProps) {
  const [activeSession, setActiveSession] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  const meditationSessions = {
    focus: {
      title: "Focus & Concentration",
      icon: Target,
      duration: 10,
      color: "bg-blue-100 border-blue-300",
      steps: [
        { text: "Find a comfortable seated position and close your eyes gently.", duration: 30 },
        { text: "Take three deep breaths, feeling your body settle with each exhale.", duration: 45 },
        { text: "Notice your natural breathing rhythm without trying to change it.", duration: 60 },
        { text: "When your mind wanders, gently bring attention back to your breath.", duration: 90 },
        {
          text: "Imagine a bright light at the center of your forehead, growing brighter with each breath.",
          duration: 120,
        },
        { text: "This light represents your focused awareness. Let it expand and strengthen.", duration: 120 },
        { text: "Feel this focused energy flowing through your entire being.", duration: 90 },
        { text: "Take a moment to appreciate this state of calm focus.", duration: 60 },
        { text: "Slowly wiggle your fingers and toes, preparing to return.", duration: 30 },
        { text: "Open your eyes when ready, carrying this focus with you.", duration: 30 },
      ],
    },
    stress: {
      title: "Stress Relief",
      icon: Waves,
      duration: 12,
      color: "bg-green-100 border-green-300",
      steps: [
        { text: "Sit or lie down comfortably, allowing your body to fully relax.", duration: 45 },
        { text: "Take a deep breath in through your nose, hold for 4 counts.", duration: 30 },
        { text: "Exhale slowly through your mouth, releasing all tension.", duration: 30 },
        { text: "Starting with your toes, consciously relax each part of your body.", duration: 90 },
        { text: "Move up through your legs, feeling them become heavy and relaxed.", duration: 60 },
        { text: "Relax your abdomen, chest, and shoulders, letting them drop.", duration: 60 },
        { text: "Release tension from your arms, hands, neck, and face.", duration: 60 },
        { text: "Imagine stress leaving your body like dark clouds dissolving.", duration: 90 },
        { text: "Visualize peaceful, healing light filling every cell of your body.", duration: 120 },
        { text: "Rest in this state of complete relaxation and peace.", duration: 90 },
        { text: "Slowly return awareness to your surroundings.", duration: 45 },
        { text: "Open your eyes feeling refreshed and renewed.", duration: 30 },
      ],
    },
    sleep: {
      title: "Better Sleep",
      icon: Moon,
      duration: 15,
      color: "bg-purple-100 border-purple-300",
      steps: [
        { text: "Lie down comfortably in your bed, adjusting pillows as needed.", duration: 30 },
        { text: "Close your eyes and take three slow, deep breaths.", duration: 45 },
        { text: "Feel your body sinking into the mattress with each exhale.", duration: 60 },
        { text: "Starting from your head, consciously relax every muscle.", duration: 90 },
        { text: "Let your forehead smooth out, your jaw unclench.", duration: 60 },
        { text: "Allow your shoulders to drop away from your ears.", duration: 60 },
        { text: "Feel your arms become heavy and completely relaxed.", duration: 60 },
        { text: "Let your chest rise and fall naturally with each breath.", duration: 90 },
        { text: "Relax your abdomen, hips, and legs completely.", duration: 90 },
        { text: "Imagine you're floating on a calm, warm ocean.", duration: 120 },
        { text: "Feel the gentle waves rocking you peacefully.", duration: 120 },
        { text: "Let your mind become as calm as still water.", duration: 120 },
        { text: "Allow yourself to drift into peaceful, restorative sleep.", duration: 180 },
        { text: "Rest deeply, knowing you are safe and at peace.", duration: 120 },
      ],
    },
    mindfulness: {
      title: "Mindful Awareness",
      icon: Brain,
      duration: 8,
      color: "bg-yellow-100 border-yellow-300",
      steps: [
        { text: "Sit comfortably with your spine straight but not rigid.", duration: 30 },
        { text: "Close your eyes or soften your gaze downward.", duration: 30 },
        { text: "Begin to notice your breath without changing it.", duration: 60 },
        { text: "Feel the sensation of air entering and leaving your nostrils.", duration: 90 },
        { text: "When thoughts arise, simply notice them without judgment.", duration: 90 },
        { text: "Gently return your attention to the breath each time.", duration: 90 },
        { text: "Notice sounds around you, acknowledging them and letting them pass.", duration: 90 },
        { text: "Feel the present moment fully, just as it is.", duration: 90 },
        { text: "Rest in this awareness, open and accepting.", duration: 60 },
        { text: "Slowly return to normal awareness when ready.", duration: 30 },
      ],
    },
  }

  useEffect(() => {
    let interval
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setSessionTime((prev) => {
          const newTime = prev + 1
          const session = meditationSessions[activeSession]

          // Calculate which step we should be on
          let timeAccumulator = 0
          let stepIndex = 0

          for (let i = 0; i < session.steps.length; i++) {
            timeAccumulator += session.steps[i].duration
            if (newTime <= timeAccumulator) {
              stepIndex = i
              break
            }
          }

          setCurrentStep(stepIndex)

          // End session when complete
          if (newTime >= session.duration * 60) {
            setIsPlaying(false)
            return session.duration * 60
          }

          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, activeSession])

  const startSession = (sessionType) => {
    setActiveSession(sessionType)
    setSessionTime(0)
    setCurrentStep(0)
    setTotalTime(meditationSessions[sessionType].duration * 60)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetSession = () => {
    setIsPlaying(false)
    setSessionTime(0)
    setCurrentStep(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (activeSession) {
    const session = meditationSessions[activeSession]
    const progress = (sessionTime / totalTime) * 100
    const currentStepData = session.steps[currentStep]

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className={`${session.color} backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <session.icon className="w-6 h-6" />
              <span>{session.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🧘‍♀️</div>
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatTime(sessionTime)}</span>
                  <span>{formatTime(totalTime)}</span>
                </div>
              </div>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-lg leading-relaxed text-gray-700">
                  {currentStepData?.text || "Preparing your meditation..."}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={togglePlayPause}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button onClick={resetSession} variant="outline" size="lg">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>

              <Button onClick={() => setActiveSession(null)} variant="outline" size="lg">
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Guided Meditation</h1>
        <p className="text-white/90">AI-powered personalized meditation sessions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(meditationSessions).map(([key, session]) => {
          const Icon = session.icon
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-lg ${session.color}`}
              onClick={() => startSession(key)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Icon className="w-8 h-8 text-gray-700" />
                  <div>
                    <h3 className="text-xl font-semibold">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.duration} minutes</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {key === "focus" && "Enhance concentration and mental clarity"}
                  {key === "stress" && "Release tension and find inner peace"}
                  {key === "sleep" && "Prepare your mind and body for restful sleep"}
                  {key === "mindfulness" && "Cultivate present-moment awareness"}
                </p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Meditation Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl">🧠</div>
              <h4 className="font-semibold">Mental Clarity</h4>
              <p className="text-sm text-gray-600">Improved focus and decision-making</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">❤️</div>
              <h4 className="font-semibold">Emotional Balance</h4>
              <p className="text-sm text-gray-600">Better stress management and mood regulation</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">😴</div>
              <h4 className="font-semibold">Better Sleep</h4>
              <p className="text-sm text-gray-600">Improved sleep quality and relaxation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
