"use client"

import { useEffect, useState } from "react"

interface AnimatedBackgroundProps {
  mood: string
}

export function AnimatedBackground({ mood }: AnimatedBackgroundProps) {
  const [currentGradient, setCurrentGradient] = useState(0)

  const moodGradients = {
    happy: [
      "linear-gradient(135deg, #2D1B69 0%, #11998E 50%, #1A1A2E 100%)",
      "linear-gradient(135deg, #0F3460 0%, #16213E 50%, #0E4B99 100%)",
      "linear-gradient(135deg, #232526 0%, #414345 50%, #2C3E50 100%)",
    ],
    sad: [
      "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)",
      "linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%)",
    ],
    anxious: [
      "linear-gradient(135deg, #2C3E50 0%, #4A6741 50%, #2980B9 100%)",
      "linear-gradient(135deg, #34495E 0%, #2C3E50 50%, #4A90E2 100%)",
      "linear-gradient(135deg, #1A252F 0%, #2C3E50 50%, #34495E 100%)",
    ],
    calm: [
      "linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #4A90E2 100%)",
      "linear-gradient(135deg, #1A252F 0%, #2C3E50 50%, #34495E 100%)",
      "linear-gradient(135deg, #34495E 0%, #2C3E50 50%, #1A252F 100%)",
    ],
    angry: [
      "linear-gradient(135deg, #C33764 0%, #1D2671 50%, #2C3E50 100%)",
      "linear-gradient(135deg, #8B0000 0%, #2C3E50 50%, #1A1A2E 100%)",
      "linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #1A252F 100%)",
    ],
    excited: [
      "linear-gradient(135deg, #2D1B69 0%, #11998E 50%, #1A1A2E 100%)",
      "linear-gradient(135deg, #0F3460 0%, #16213E 50%, #0E4B99 100%)",
      "linear-gradient(135deg, #232526 0%, #414345 50%, #2C3E50 100%)",
    ],
    neutral: [
      "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      "linear-gradient(135deg, #232526 0%, #414345 50%, #2C3E50 100%)",
      "linear-gradient(135deg, #34495E 0%, #2C3E50 50%, #1A252F 100%)",
    ],
    tired: [
      "linear-gradient(135deg, #434343 0%, #000000 50%, #2C3E50 100%)",
      "linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #1A1A1A 100%)",
      "linear-gradient(135deg, #1A1A1A 0%, #2C3E50 50%, #34495E 100%)",
    ],
  }

  const gradients = moodGradients[mood as keyof typeof moodGradients] || moodGradients.neutral

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length)
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [gradients.length])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main animated gradient background */}
      <div
        className="absolute inset-0 transition-all duration-[10000ms] ease-in-out"
        style={{
          background: gradients[currentGradient],
        }}
      />

      {/* Subtle geometric overlays */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute bottom-32 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-2000" />
        </div>
      </div>

      {/* Professional mesh overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-mesh-slow" />
      </div>
    </div>
  )
}
