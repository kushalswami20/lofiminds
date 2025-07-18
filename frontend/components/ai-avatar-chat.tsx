"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageCircle,
  Phone,
  PhoneOff,
  Volume2,
  Settings,
  Gamepad2,
  Puzzle,
  Brain,
  Zap,
  Play,
  Pause,
  VolumeX,
  RotateCcw,
  Star,
} from "lucide-react"

interface AIAvatarChatProps {
  mood: string
}

export function AIAvatarChat({ mood }: AIAvatarChatProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ type: string; message: string; timestamp: string }>>([])
  const [selectedAvatar, setSelectedAvatar] = useState("sarah")
  const [showGames, setShowGames] = useState(false)
  const [currentGame, setCurrentGame] = useState(null)
  const [gameScore, setGameScore] = useState(0)
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [callDuration, setCallDuration] = useState(0)

  const avatars = {
    sarah: {
      name: "Dr. Sarah",
      specialty: "Anxiety & Stress",
      personality: "Calm and nurturing",
      image: "/placeholder.svg?height=200&width=200&text=👩‍⚕️", // Specific image for Sarah
      voice: "gentle female voice",
      gamePreference: "breathing games",
    },
    alex: {
      name: "Alex",
      specialty: "Depression Support",
      personality: "Warm and understanding",
      image: "/placeholder.svg?height=200&width=200&text=👨‍💻", // Specific image for Alex
      voice: "supportive neutral voice",
      gamePreference: "puzzle games",
    },
    maya: {
      name: "Dr. Maya",
      specialty: "Sleep & Relaxation",
      personality: "Soothing and peaceful",
      image: "/placeholder.svg?height=200&width=200&text=🧘‍♀️", // Specific image for Maya
      voice: "soft female voice",
      gamePreference: "meditation games",
    },
  }

  const mindGames = [
    {
      id: "breathing-bubble",
      name: "Breathing Bubble",
      description: "Follow the expanding bubble to regulate your breathing",
      category: "breathing",
      difficulty: "Easy",
      duration: "2-5 min",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: "color-meditation",
      name: "Color Flow Meditation",
      description: "Watch calming colors flow and focus your mind",
      category: "meditation",
      difficulty: "Easy",
      duration: "3-10 min",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: "memory-calm",
      name: "Peaceful Memory",
      description: "Memory game with calming nature sounds and images",
      category: "cognitive",
      difficulty: "Medium",
      duration: "5-15 min",
      icon: <Puzzle className="w-6 h-6" />,
    },
    {
      id: "gratitude-journal",
      name: "Gratitude Moments",
      description: "Interactive gratitude practice with AI guidance",
      category: "mindfulness",
      difficulty: "Easy",
      duration: "5-10 min",
      icon: <Star className="w-6 h-6" />,
    },
  ]

  const currentAvatar = avatars[selectedAvatar as keyof typeof avatars]

  const moodGreetings = {
    happy:
      "I can sense your positive energy today! That's wonderful. Would you like to try some uplifting games to maintain this great mood?",
    sad: "I notice you might be feeling down today. I'm here to listen and support you. Perhaps some gentle, calming activities might help?",
    anxious:
      "I can feel some tension in your voice. Let's take this slowly. I have some breathing games that might help you feel more centered.",
    angry:
      "I hear the frustration in your words. It's completely valid to feel this way. Would you like to try some calming exercises together?",
    tired:
      "You sound exhausted. Sometimes we all need someone to talk to when we're feeling drained. I have some relaxing activities we could explore.",
    neutral:
      "Hello there. I'm here to listen and support you. Would you like to chat, or perhaps try some mindful games together?",
  }

  // Simulate AI voice synthesis
  const speakMessage = (message: string) => {
    if (!aiVoiceEnabled) return

    setIsSpeaking(true)

    // Simulate speech synthesis
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.8
      utterance.pitch = selectedAvatar === "sarah" ? 1.2 : selectedAvatar === "maya" ? 1.1 : 1.0
      utterance.volume = 0.7

      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      // Fallback: simulate speaking duration
      setTimeout(() => setIsSpeaking(false), message.length * 50)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const startCall = () => {
    setIsCallActive(true)
    setCallDuration(0)
    const greeting = moodGreetings[mood as keyof typeof moodGreetings] || moodGreetings.neutral

    setChatHistory([
      {
        type: "ai",
        message: greeting,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])

    // Simulate camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.log("Camera access denied:", err))
    }

    // AI speaks the greeting
    setTimeout(() => speakMessage(greeting), 1000)
  }

  const endCall = () => {
    setIsCallActive(false)
    setCallDuration(0)
    setChatHistory([])
    setShowGames(false)
    setCurrentGame(null)

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }

    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const simulateListening = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)

      const responses = [
        "I understand how you're feeling. That sounds really challenging. Would you like to try a breathing exercise together?",
        "Thank you for sharing that with me. Your feelings are completely valid. I think a calming game might help right now.",
        "It takes courage to open up about these things. I'm proud of you for reaching out. Let's try something relaxing together.",
        "Let's explore that feeling together. I have some mindful activities that might help you process this.",
        "I hear the pain in your voice. Remember, you're not alone in this journey. Would you like to try the gratitude game?",
        "That's a very human response to what you're going through. How about we play a gentle memory game to help calm your mind?",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      // AI speaks the response
      setTimeout(() => speakMessage(randomResponse), 500)
    }, 2000)
  }

  const suggestGame = () => {
    const gameRecommendations = {
      happy: "Since you're feeling great, how about the Color Flow Meditation to maintain this positive energy?",
      sad: "I think the Breathing Bubble game might help you feel more centered right now.",
      anxious: "The Breathing Bubble exercise could really help calm your nerves. Shall we try it together?",
      angry: "Let's try the Peaceful Memory game to help channel that energy into something calming.",
      tired: "The Color Flow Meditation might be perfect for you right now - it's very gentle and relaxing.",
      neutral:
        "I'd recommend starting with the Gratitude Moments game - it's a lovely way to shift into a positive mindset.",
    }

    const suggestion = gameRecommendations[mood as keyof typeof moodGreetings] || gameRecommendations.neutral

    setChatHistory((prev) => [
      ...prev,
      {
        type: "ai",
        message: suggestion,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])

    speakMessage(suggestion)
    setShowGames(true)
  }

  const startGame = (game: any) => {
    setCurrentGame(game)
    setGameScore(0)

    const gameIntro = `Great choice! Let's start ${game.name}. I'll guide you through this ${game.duration} experience. Remember, there's no pressure - just focus on the moment.`

    setChatHistory((prev) => [
      ...prev,
      {
        type: "ai",
        message: gameIntro,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])

    speakMessage(gameIntro)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Game Components
  const renderBreathingBubble = () => (
    <div className="text-center space-y-6 p-6">
      <h3 className="text-xl font-semibold">Breathing Bubble</h3>
      <div className="relative w-48 h-48 mx-auto">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-200 to-purple-200 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium">Breathe In</div>
            <div className="text-sm text-gray-600">4 seconds</div>
          </div>
        </div>
      </div>
      <p className="text-gray-600">Follow the bubble's rhythm. Breathe in as it expands, out as it contracts.</p>
      <Button onClick={() => setCurrentGame(null)} variant="outline">
        <RotateCcw className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
    </div>
  )

  const renderColorMeditation = () => (
    <div className="text-center space-y-6 p-6">
      <h3 className="text-xl font-semibold">Color Flow Meditation</h3>
      <div className="w-full h-48 rounded-lg bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 animate-gradient-x"></div>
      <p className="text-gray-600">Watch the colors flow and let your mind follow their peaceful movement.</p>
      <div className="flex justify-center space-x-4">
        <Button size="sm">
          <Play className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Pause className="w-4 h-4" />
        </Button>
        <Button onClick={() => setCurrentGame(null)} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  )

  if (currentGame) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-0">
            {currentGame.id === "breathing-bubble" && renderBreathingBubble()}
            {currentGame.id === "color-meditation" && renderColorMeditation()}
            {currentGame.id === "memory-calm" && (
              <div className="text-center space-y-6 p-6">
                <h3 className="text-xl font-semibold">Peaceful Memory</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-green-200 to-blue-200 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <span className="text-2xl">🌸</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Badge>Score: {gameScore}</Badge>
                  <Button onClick={() => setCurrentGame(null)} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            )}
            {currentGame.id === "gratitude-journal" && (
              <div className="text-center space-y-6 p-6">
                <h3 className="text-xl font-semibold">Gratitude Moments</h3>
                <div className="space-y-4">
                  <div className="text-6xl">🌟</div>
                  <p className="text-gray-600">Think of three things you're grateful for today...</p>
                  <div className="space-y-2">
                    <input className="w-full p-2 border rounded-lg" placeholder="I'm grateful for..." />
                    <input className="w-full p-2 border rounded-lg" placeholder="I appreciate..." />
                    <input className="w-full p-2 border rounded-lg" placeholder="I'm thankful for..." />
                  </div>
                </div>
                <Button onClick={() => setCurrentGame(null)} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCallActive) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Companion Session</h1>
            <p className="text-white/90">
              with {currentAvatar.name} • {formatTime(callDuration)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={suggestGame} variant="outline">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </Button>
            <Button onClick={endCall} variant="destructive">
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Avatar with Voice Indicator */}
          <Card className="bg-gradient-to-br from-purple-100 to-blue-100">
            <CardContent className="p-0 relative aspect-video">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg">
                <div className="text-center">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-4 ${isSpeaking ? "ring-4 ring-green-400 animate-pulse" : ""}`}
                  >
                    <img
                      src={currentAvatar.image || "/placeholder.svg"}
                      alt={currentAvatar.name}
                      className="w-24 h-24 rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{currentAvatar.name}</h3>
                  <p className="text-gray-600">{currentAvatar.specialty}</p>

                  {/* Voice Status */}
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}>
                      {aiVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    {isSpeaking && <Badge className="bg-green-100 text-green-800">Speaking...</Badge>}
                    {isListening && <Badge className="bg-blue-100 text-blue-800">Listening...</Badge>}
                  </div>

                  {isSpeaking && (
                    <div className="flex justify-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Video */}
          <Card className="bg-black rounded-2xl overflow-hidden">
            <CardContent className="p-0 relative aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                <Button
                  size="sm"
                  variant={isVideoOn ? "default" : "destructive"}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isAudioOn ? "default" : "destructive"}
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={simulateListening}
                  disabled={isListening}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isListening ? "Listening..." : "Speak"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Section */}
        {showGames && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-purple-600" />
                <span>Mind-Relaxing Games</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mindGames.map((game) => (
                  <Card
                    key={game.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => startGame(game)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-purple-600">{game.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{game.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{game.difficulty}</Badge>
                            <Badge variant="outline">{game.duration}</Badge>
                            <Badge className="bg-purple-100 text-purple-800">{game.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Conversation</span>
              {aiVoiceEnabled && <Badge className="bg-green-100 text-green-800">Voice Enabled</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === "ai" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "ai" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Companion Chat</h1>
        <p className="text-white/90">Real-time video conversation with voice-enabled AI and mind-relaxing games</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>Choose Your AI Companion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(avatars).map(([key, avatar]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedAvatar === key ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedAvatar(key)}
              >
                <CardContent className="p-4 text-center">
                  <img
                    src={avatar.image || "/placeholder.svg"}
                    alt={avatar.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                  />
                  <h3 className="font-semibold">{avatar.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{avatar.specialty}</p>
                  <p className="text-xs text-gray-500 mb-2">{avatar.personality}</p>
                  <Badge className="bg-purple-100 text-purple-800">{avatar.gamePreference}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-green-600" />
              <span>Voice Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-blue-600" />
                <span>Real-time video conversation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-green-600" />
                <span>Voice recognition and response</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>Natural AI voice synthesis</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-orange-600" />
                <span>Empathetic conversation flow</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              <span>Mind Games</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>Breathing regulation games</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span>Color meditation experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <Puzzle className="w-4 h-4 text-purple-600" />
                <span>Calming memory challenges</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>Gratitude practice activities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={startCall}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Phone className="w-5 h-5 mr-2" />
          Start Voice Call with {currentAvatar.name}
        </Button>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Enhanced AI Experience</h4>
              <p className="text-sm text-yellow-700">
                Your AI companion can now speak to you naturally and suggest personalized mind-relaxing games based on
                your mood. All conversations are processed locally for your privacy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
