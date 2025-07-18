"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Gamepad2,
  Star,
  RotateCcw,
  Play,
  Pause,
  Trophy,
  Timer,
  Heart,
  Zap,
  Target,
  Puzzle,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"

interface MindGamesProps {
  mood: string
}

export function MindGames({ mood }: MindGamesProps) {
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<
    Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>
  >([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // Breathing Game State
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCycle, setBreathingCycle] = useState(0)

  // Color Harmony Game State
  const [colorSequence, setColorSequence] = useState<string[]>([])
  const [playerSequence, setPlayerSequence] = useState<string[]>([])
  const [showingSequence, setShowingSequence] = useState(false)
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const colors = ["red", "blue", "green", "yellow"]

  // Zen Puzzle Game State
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const puzzleImage = "/placeholder.svg?height=300&width=300" // Placeholder image for the puzzle

  // Gratitude Stars Game State
  const [gratitudeEntries, setGratitudeEntries] = useState(["", "", ""])
  const [gratitudeSubmitted, setGratitudeSubmitted] = useState(false)

  // Focus Target Game State
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; active: boolean }>>([])
  const [targetHits, setTargetHits] = useState(0)
  const [targetMisses, setTargetMisses] = useState(0)

  const games = [
    {
      id: "memory-garden",
      name: "Memory Garden",
      description: "Match peaceful nature pairs to create a beautiful garden",
      category: "Memory",
      difficulty: "Easy",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-green-100 border-green-300",
      benefits: ["Improves focus", "Reduces anxiety", "Enhances memory"],
    },
    {
      id: "breathing-bubble",
      name: "Breathing Bubble",
      description: "Follow the bubble's rhythm to regulate your breathing",
      category: "Breathing",
      difficulty: "Easy",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-blue-100 border-blue-300",
      benefits: ["Reduces stress", "Calms mind", "Improves focus"],
    },
    {
      id: "color-harmony",
      name: "Color Harmony",
      description: "Follow the color sequence to create beautiful patterns",
      category: "Focus",
      difficulty: "Medium",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-purple-100 border-purple-300",
      benefits: ["Enhances concentration", "Reduces overthinking", "Promotes mindfulness"],
    },
    {
      id: "zen-puzzle",
      name: "Zen Puzzle",
      description: "Arrange peaceful scenes while listening to calming sounds",
      category: "Puzzle",
      difficulty: "Medium",
      icon: <Puzzle className="w-6 h-6" />,
      color: "bg-yellow-100 border-yellow-300",
      benefits: ["Problem solving", "Stress relief", "Mental clarity"],
    },
    {
      id: "gratitude-stars",
      name: "Gratitude Stars",
      description: "Collect stars by reflecting on positive moments",
      category: "Mindfulness",
      difficulty: "Easy",
      icon: <Star className="w-6 h-6" />,
      color: "bg-pink-100 border-pink-300",
      benefits: ["Positive thinking", "Emotional wellness", "Self-reflection"],
    },
    {
      id: "focus-target",
      name: "Focus Target",
      description: "Hit targets while maintaining calm breathing",
      category: "Concentration",
      difficulty: "Hard",
      icon: <Target className="w-6 h-6" />,
      color: "bg-orange-100 border-orange-300",
      benefits: ["Improves attention", "Hand-eye coordination", "Stress management"],
    },
  ]

  // Initialize Memory Game
  const initMemoryGame = () => {
    const emojis = ["🌸", "🌿", "🦋", "🌺", "🍃", "🌻", "🌙", "⭐"]
    const cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }))
    setMemoryCards(cards)
    setFlippedCards([])
    setGameScore(0)
  }

  // Memory Game Logic
  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (memoryCards[cardId].flipped || memoryCards[cardId].matched) return

    const newCards = [...memoryCards]
    newCards[cardId].flipped = true
    setMemoryCards(newCards)

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards]
          matchedCards[first].matched = true
          matchedCards[second].matched = true
          setMemoryCards(matchedCards)
          setFlippedCards([])
          setGameScore((prev) => prev + 10)
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[first].flipped = false
          resetCards[second].flipped = false
          setMemoryCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Breathing Game Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentGame === "breathing-bubble" && isGameActive) {
      interval = setInterval(() => {
        setGameTime((prev) => {
          const newTime = prev + 1
          const cycleTime = newTime % 19 // 4s inhale + 7s hold + 8s exhale

          if (cycleTime < 4) {
            setBreathingPhase("inhale")
          } else if (cycleTime < 11) {
            setBreathingPhase("hold")
          } else {
            setBreathingPhase("exhale")
          }

          if (cycleTime === 18) {
            setBreathingCycle((prev) => prev + 1)
            setGameScore((prev) => prev + 5)
          }

          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentGame, isGameActive])

  // Color Harmony Game Logic
  useEffect(() => {
    let sequenceTimer: NodeJS.Timeout
    if (currentGame === "color-harmony" && isGameActive) {
      if (showingSequence) {
        if (sequenceIndex < colorSequence.length) {
          sequenceTimer = setTimeout(() => {
            setSequenceIndex((prev) => prev + 1)
          }, 800)
        } else {
          setShowingSequence(false)
          setPlayerSequence([])
          setSequenceIndex(0)
        }
      }
    }
    return () => clearTimeout(sequenceTimer)
  }, [currentGame, isGameActive, showingSequence, sequenceIndex, colorSequence])

  const generateColorSequence = () => {
    const newSequence = Array.from(
      { length: gameScore / 10 + 3 },
      () => colors[Math.floor(Math.random() * colors.length)],
    )
    setColorSequence(newSequence)
    setShowingSequence(true)
    setSequenceIndex(0)
  }

  const handleColorClick = (color: string) => {
    if (showingSequence) return

    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)

    if (newPlayerSequence.length === colorSequence.length) {
      if (newPlayerSequence.every((val, i) => val === colorSequence[i])) {
        setGameScore((prev) => prev + 10)
        setTimeout(generateColorSequence, 1000)
      } else {
        setGameScore(0) // Reset score on wrong sequence
        alert("Wrong sequence! Try again.")
        setTimeout(generateColorSequence, 1000)
      }
    }
  }

  // Zen Puzzle Game Logic
  const initZenPuzzle = () => {
    const pieces = Array.from({ length: 9 }, (_, i) => i) // 3x3 puzzle
    setPuzzlePieces(pieces.sort(() => Math.random() - 0.5))
    setSelectedPiece(null)
    setGameScore(0)
  }

  const handlePuzzleClick = (index: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(index)
    } else {
      const newPieces = [...puzzlePieces]
      ;[newPieces[index], newPieces[selectedPiece]] = [newPieces[selectedPiece], newPieces[index]] // Swap
      setPuzzlePieces(newPieces)
      setSelectedPiece(null)

      // Check for win condition (simplified: if sorted)
      if (newPieces.every((val, i) => val === i)) {
        setGameScore((prev) => prev + 100)
        alert("Puzzle Solved!")
        setIsGameActive(false)
      }
    }
  }

  // Gratitude Stars Logic
  const handleGratitudeChange = (index: number, value: string) => {
    const newEntries = [...gratitudeEntries]
    newEntries[index] = value
    setGratitudeEntries(newEntries)
  }

  const submitGratitude = () => {
    if (gratitudeEntries.every((entry) => entry.trim() !== "")) {
      setGratitudeSubmitted(true)
      setGameScore((prev) => prev + 50)
      // Simulate AI feedback
      alert("Wonderful! Reflecting on gratitude boosts your well-being. Keep shining!")
    } else {
      alert("Please fill in all gratitude entries.")
    }
  }

  // Focus Target Game Logic
  useEffect(() => {
    let targetSpawnTimer: NodeJS.Timeout
    if (currentGame === "focus-target" && isGameActive) {
      targetSpawnTimer = setInterval(() => {
        if (targets.length < 5) {
          // Max 5 targets at once
          spawnTarget()
        }
      }, 1000) // Spawn a new target every second
    }
    return () => clearInterval(targetSpawnTimer)
  }, [currentGame, isGameActive, targets.length])

  const spawnTarget = () => {
    const newTarget = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10% to 90% width
      y: Math.random() * 80 + 10, // 10% to 90% height
      active: true,
    }
    setTargets((prev) => [...prev, newTarget])

    // Target disappears after a few seconds if not hit
    setTimeout(() => {
      setTargets((prev) => prev.map((t) => (t.id === newTarget.id ? { ...t, active: false } : t)))
      setTargetMisses((prev) => prev + 1)
    }, 2000) // Target active for 2 seconds
  }

  const handleClickTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id))
    setGameScore((prev) => prev + 10)
    setTargetHits((prev) => prev + 1)
  }

  const startGame = (gameId: string) => {
    setCurrentGame(gameId)
    setGameScore(0)
    setGameTime(0)
    setIsGameActive(true)
    setTargetHits(0)
    setTargetMisses(0)
    setGratitudeSubmitted(false)
    setGratitudeEntries(["", "", ""])

    if (gameId === "memory-garden") {
      initMemoryGame()
    } else if (gameId === "breathing-bubble") {
      setBreathingCycle(0)
      setBreathingPhase("inhale")
    } else if (gameId === "color-harmony") {
      generateColorSequence()
    } else if (gameId === "zen-puzzle") {
      initZenPuzzle()
    } else if (gameId === "focus-target") {
      setTargets([])
      spawnTarget() // Spawn initial target
    }
  }

  const endGame = () => {
    setCurrentGame(null)
    setIsGameActive(false)
    setGameTime(0)
    setGameScore(0)
    setTargets([])
    setTargetHits(0)
    setTargetMisses(0)
    setGratitudeSubmitted(false)
    setGratitudeEntries(["", "", ""])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Render Memory Game
  const renderMemoryGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Memory Garden</h3>
        <p className="text-gray-600">Match the nature pairs to create your peaceful garden</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800">
            <Trophy className="w-4 h-4 mr-1" />
            Score: {gameScore}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Timer className="w-4 h-4 mr-1" />
            {formatTime(gameTime)}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {memoryCards.map((card) => (
          <div
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all
              ${
                card.flipped || card.matched
                  ? "bg-white shadow-md"
                  : "bg-gradient-to-br from-green-200 to-green-300 hover:from-green-300 hover:to-green-400"
              }
              ${card.matched ? "ring-2 ring-green-500" : ""}
            `}
          >
            {card.flipped || card.matched ? card.emoji : "🌱"}
          </div>
        ))}
      </div>

      {memoryCards.every((card) => card.matched) && (
        <div className="text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h4 className="text-xl font-semibold text-green-800">Garden Complete!</h4>
          <p className="text-green-600">You've created a beautiful memory garden!</p>
          <Button onClick={() => initMemoryGame()} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  )

  // Render Breathing Game
  const renderBreathingGame = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">Breathing Bubble</h3>
        <p className="text-gray-600">Follow the bubble's rhythm to find your calm</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800">
            <Heart className="w-4 h-4 mr-1" />
            Cycles: {breathingCycle}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Timer className="w-4 h-4 mr-1" />
            {formatTime(gameTime)}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="relative w-64 h-64 mx-auto">
        <div
          className={`
            w-full h-full rounded-full transition-all duration-1000 flex items-center justify-center
            ${
              breathingPhase === "inhale"
                ? "scale-110 bg-gradient-to-r from-blue-200 to-cyan-200"
                : breathingPhase === "hold"
                  ? "scale-110 bg-gradient-to-r from-purple-200 to-pink-200"
                  : "scale-90 bg-gradient-to-r from-green-200 to-emerald-200"
            }
          `}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold capitalize">{breathingPhase}</div>
            <div className="text-sm">
              {breathingPhase === "inhale" ? "4 sec" : breathingPhase === "hold" ? "7 sec" : "8 sec"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium">
          {breathingPhase === "inhale"
            ? "Breathe in slowly through your nose..."
            : breathingPhase === "hold"
              ? "Hold your breath gently..."
              : "Exhale slowly through your mouth..."}
        </p>
        <p className="text-sm text-gray-600">Score: {gameScore} points</p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setIsGameActive(!isGameActive)}
          className={isGameActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
        >
          {isGameActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isGameActive ? "Pause" : "Resume"}
        </Button>
      </div>
    </div>
  )

  // Render Color Harmony Game
  const renderColorHarmonyGame = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">Color Harmony</h3>
        <p className="text-gray-600">Memorize the sequence and repeat it!</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-purple-100 text-purple-800">
            <Trophy className="w-4 h-4 mr-1" />
            Score: {gameScore}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="relative w-full max-w-md mx-auto aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        {showingSequence ? (
          <div
            className={`w-32 h-32 rounded-full transition-colors duration-500 ${
              sequenceIndex < colorSequence.length ? `bg-${colorSequence[sequenceIndex]}-500` : "bg-gray-300"
            }`}
          ></div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 w-full h-full">
            {colors.map((color) => (
              <Button
                key={color}
                className={`w-full h-full capitalize bg-${color}-500 hover:bg-${color}-600`}
                onClick={() => handleColorClick(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        )}
      </div>
      <p className="text-lg font-medium">
        {showingSequence
          ? "Watch the sequence..."
          : playerSequence.length === 0
            ? "Repeat the sequence!"
            : `Your sequence: ${playerSequence.join(", ")}`}
      </p>
      <Button onClick={generateColorSequence} disabled={showingSequence}>
        Start New Sequence
      </Button>
    </div>
  )

  // Render Zen Puzzle Game
  const renderZenPuzzleGame = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">Zen Puzzle</h3>
        <p className="text-gray-600">Click pieces to swap and complete the image</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-yellow-100 text-yellow-800">
            <Trophy className="w-4 h-4 mr-1" />
            Score: {gameScore}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div
        className="grid grid-cols-3 gap-1 max-w-sm mx-auto border-2 border-gray-300"
        style={{
          width: "300px",
          height: "300px",
          backgroundImage: `url(${puzzleImage})`,
          backgroundSize: "300% 300%", // For 3x3 grid
        }}
      >
        {puzzlePieces.map((piece, index) => (
          <div
            key={index}
            onClick={() => handlePuzzleClick(index)}
            className={`
              w-full h-full border border-gray-400 cursor-pointer transition-all duration-200
              ${selectedPiece === index ? "ring-2 ring-blue-500" : ""}
            `}
            style={{
              backgroundPosition: `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`,
              opacity: piece === 8 ? 0 : 1, // Hide one piece for sliding puzzle effect
            }}
          >
            {/* You can add numbers or just rely on the image */}
          </div>
        ))}
      </div>
      <Button onClick={initZenPuzzle}>Shuffle & Restart</Button>
    </div>
  )

  // Render Gratitude Stars Game
  const renderGratitudeStarsGame = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">Gratitude Moments</h3>
        <p className="text-gray-600">Reflect on things you're grateful for and collect stars!</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-pink-100 text-pink-800">
            <Star className="w-4 h-4 mr-1" />
            Stars: {gameScore}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {!gratitudeSubmitted ? (
          <>
            {gratitudeEntries.map((entry, index) => (
              <input
                key={index}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
                placeholder={`I'm grateful for... (Entry ${index + 1})`}
                value={entry}
                onChange={(e) => handleGratitudeChange(index, e.target.value)}
              />
            ))}
            <Button onClick={submitGratitude} className="w-full bg-pink-500 hover:bg-pink-600">
              Submit Gratitude
            </Button>
          </>
        ) : (
          <div className="bg-pink-50 p-6 rounded-lg space-y-3">
            <div className="text-4xl">✨</div>
            <h4 className="font-semibold text-pink-800">Thank you for sharing!</h4>
            <p className="text-sm text-pink-700">
              Reflecting on gratitude is a powerful way to boost your well-being. Keep noticing the good things!
            </p>
            <Button
              onClick={() => {
                setGratitudeSubmitted(false)
                setGratitudeEntries(["", "", ""])
              }}
              variant="outline"
            >
              Add More Gratitude
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // Render Focus Target Game
  const renderFocusTargetGame = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">Focus Target</h3>
        <p className="text-gray-600">Click the targets as they appear!</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge className="bg-orange-100 text-orange-800">
            <Trophy className="w-4 h-4 mr-1" />
            Hits: {targetHits}
          </Badge>
          <Badge className="bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Misses: {targetMisses}
          </Badge>
        </div>
        <Button onClick={endGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="relative w-full max-w-lg mx-auto aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {targets
          .filter((t) => t.active)
          .map((target) => (
            <div
              key={target.id}
              className="absolute w-12 h-12 bg-orange-500 rounded-full cursor-pointer animate-pulse-fast"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              onClick={() => handleClickTarget(target.id)}
            ></div>
          ))}
      </div>
      <Button
        onClick={() => {
          setIsGameActive(!isGameActive)
          if (!isGameActive) spawnTarget()
        }}
      >
        {isGameActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
        {isGameActive ? "Pause" : "Start/Resume"}
      </Button>
    </div>
  )

  if (currentGame) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            {currentGame === "memory-garden" && renderMemoryGame()}
            {currentGame === "breathing-bubble" && renderBreathingGame()}
            {currentGame === "color-harmony" && renderColorHarmonyGame()}
            {currentGame === "zen-puzzle" && renderZenPuzzleGame()}
            {currentGame === "gratitude-stars" && renderGratitudeStarsGame()}
            {currentGame === "focus-target" && renderFocusTargetGame()}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mind-Relaxing Games</h1>
        <p className="text-white/90">Engaging activities designed to calm your mind and reduce stress</p>
      </div>

      {/* Game Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Game Settings</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-transparent"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="ml-2">{soundEnabled ? "Sound On" : "Sound Off"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${game.color}`}
            onClick={() => startGame(game.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-purple-600">{game.icon}</div>
                <Badge variant="outline">{game.difficulty}</Badge>
              </div>

              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4 text-sm">{game.description}</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-100 text-gray-800">{game.category}</Badge>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-1">Benefits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {game.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Play className="w-4 h-4 mr-2" />
                  Play Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Brain className="w-6 h-6" />
            <span>Why Mind Games Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="font-semibold">Stress Reduction</h4>
              <p className="text-sm text-gray-600">Games provide a healthy distraction from worries and anxiety</p>
            </div>
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 text-green-600 mx-auto" />
              <h4 className="font-semibold">Improved Focus</h4>
              <p className="text-sm text-gray-600">Regular play enhances concentration and attention span</p>
            </div>
            <div className="text-center space-y-2">
              <Heart className="w-8 h-8 text-red-600 mx-auto" />
              <h4 className="font-semibold">Emotional Balance</h4>
              <p className="text-sm text-gray-600">Mindful gaming promotes emotional regulation and well-being</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
