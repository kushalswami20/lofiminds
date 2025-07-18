"use client"

import { useState } from "react"
import { MoodSelector } from "@/components/mood-selector"
import { JournalAssistant } from "@/components/journal-assistant"
import { MusicPlayer } from "@/components/music-player"
// import { MeditationTools } from "@/components/meditation-tools"
import  CommunityFeed  from "@/components/community-feed"
import { GuidedMeditation } from "@/components/guided-meditation"
import { Navigation } from "@/components/navigation"
import  VirtualMeditationRoom  from "@/components/virtual-meditation-room"
import { AIAvatarChat } from "@/components/ai-avatar-chat"
import { CrisisSupport } from "@/components/crisis-support"
// import { BookSession } from "../components/book-session"
import { BTMIQuestionnaire } from "@/components/btmi-questionnaire"

import BookSession from "../components/book-session"
import { MindGames } from "@/components/mind-games"
import { AnimatedBackground } from "@/components/animated-background"
import { GodsGuidance } from "@/components/gods-guidance"
import { ThoughtIllustration } from "@/components/thought-illustration"

export default function Home() {
  const [currentMood, setCurrentMood] = useState<string>("neutral")
  const [activeSection, setActiveSection] = useState<string>("home")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "journal":
        return <JournalAssistant mood={currentMood} />
      case "music":
        return <MusicPlayer mood={currentMood} />
      // case "meditation":
      //   return <MeditationTools mood={currentMood} />
      case "btmi":
        return <BTMIQuestionnaire mood={currentMood} />
      case "guided":
        return <GuidedMeditation mood={currentMood} />
      case "community":
        return <CommunityFeed />
      case "virtual-room":
        return <VirtualMeditationRoom mood={currentMood} />
      case "ai-companion": // Corrected from "ai-avatar"
        return <AIAvatarChat mood={currentMood} />
      case "mind-games":
        return <MindGames mood={currentMood} />
      case "crisis-support":
        return <CrisisSupport />
      case "book-session":
        return <BookSession />
      default:
        return (
          <div className="space-y-12 relative z-10">
            {/* Welcome Section */}
            <div className="text-center py-12">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Welcome to Your Digital Sanctuary</h1>
                <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                  An AI-powered mental wellness platform combining technology and spirituality to provide personalized
                  support, therapeutic tools, and divine guidance for your emotional well-being journey.
                </p>
              </div>
            </div>

            {/* Thought Transformation Illustration */}
            <div className="max-w-6xl mx-auto mb-12">
              <ThoughtIllustration />
            </div>

            {/* Mood Selector Section */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-white mb-4 drop-shadow-md">Check In With Yourself</h2>
                <p className="text-white/80 text-lg drop-shadow-sm">
                  Your emotional state guides our personalized recommendations and spiritual guidance
                </p>
              </div>
              <MoodSelector currentMood={currentMood} onMoodChange={setCurrentMood} />
            </div>

            {/* Personalized Guidance Section */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-white mb-4 drop-shadow-md">Personalized Divine Guidance</h2>
                <p className="text-white/80 text-lg drop-shadow-sm">
                  AI-curated spiritual wisdom and actionable insights tailored to your current emotional state
                </p>
              </div>
              <GodsGuidance mood={currentMood} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground mood={currentMood} />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="container mx-auto px-4 py-8 relative z-10">{renderActiveSection()}</main>
    </div>
  )
}
