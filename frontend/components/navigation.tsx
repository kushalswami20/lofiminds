"use client"
import { Button } from "@/components/ui/button"
import {
  Home,
  BookOpen,
  Music,
  Brain,
  Compass,
  Video,
  MessageCircle,
  Gamepad2,
  Heart,
  Calendar,
  Users,
} from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "music", label: "Music", icon: Music },
    { id: "meditation", label: "Meditation", icon: Brain },
    { id: "guided", label: "Guided", icon: Compass },
    { id: "virtual-room", label: "Virtual Room", icon: Video },
    { id: "ai-companion", label: "AI Companion", icon: MessageCircle },
    { id: "mind-games", label: "Mind Games", icon: Gamepad2 },
    { id: "crisis-support", label: "Crisis Support", icon: Heart },
    { id: "book-session", label: "Book Session", icon: Calendar },
    { id: "community", label: "Community", icon: Users },
  ]

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🧠</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg whitespace-nowrap">Lofi Minds</h1>
              <p className="text-white/70 text-xs whitespace-nowrap">AI Mental Wellness</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    flex items-center space-x-1 px-2 py-1 text-xs whitespace-nowrap
                    ${
                      isActive
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
