"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Lightbulb, Shield, Coffee, Smile, Brain } from "lucide-react"

interface GodsGuidanceProps {
  mood: string
}

export function GodsGuidance({ mood }: GodsGuidanceProps) {
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const guidanceData = {
    happy: {
      icon: <Smile className="w-8 h-8 text-yellow-600" />,
      color: "from-yellow-100 to-orange-100",
      borderColor: "border-yellow-200",
      messages: [
        {
          title: "Embrace Your Joy",
          verse: '"Rejoice in the Lord always. I will say it again: Rejoice!" - Philippians 4:4',
          guidance:
            "Your happiness is a gift from above. Share this positive energy with others and let it multiply. Consider expressing gratitude through journaling or helping someone in need today.",
          action: "Write down 3 things you're grateful for and share your joy with a friend.",
        },
        {
          title: "Spread Light",
          verse: '"Let your light shine before others..." - Matthew 5:16',
          guidance:
            "Your joyful spirit can illuminate the path for others. Use this positive energy to encourage someone who might be struggling. Your happiness has the power to heal.",
          action: "Reach out to someone who needs encouragement today.",
        },
        {
          title: "Celebrate Mindfully",
          verse: '"This is the day the Lord has made; let us rejoice and be glad in it." - Psalm 118:24',
          guidance:
            "While celebrating your happiness, remember to stay grounded in gratitude. Take time to appreciate the small moments and blessings that led to this joy.",
          action: "Practice mindful appreciation for 5 minutes, focusing on present blessings.",
        },
      ],
    },
    sad: {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      color: "from-blue-100 to-indigo-100",
      borderColor: "border-blue-200",
      messages: [
        {
          title: "You Are Not Alone",
          verse: '"The Lord is close to the brokenhearted and saves those who are crushed in spirit." - Psalm 34:18',
          guidance:
            "Your sadness is acknowledged and valid. Even in darkness, you are held by love greater than your pain. This season of sorrow will pass, and healing will come.",
          action: "Reach out to a trusted friend or counselor. Allow yourself to feel supported.",
        },
        {
          title: "Hope in Darkness",
          verse: '"Weeping may stay for the night, but rejoicing comes in the morning." - Psalm 30:5',
          guidance:
            "This difficult time is temporary. Your tears are not wasted - they water the seeds of compassion and strength within you. Better days are ahead.",
          action: "Write a letter to your future self, expressing hope for brighter days.",
        },
        {
          title: "Gentle Self-Care",
          verse: '"Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28',
          guidance:
            "Be gentle with yourself during this time. Rest is not weakness - it's necessary for healing. Take small steps toward self-care and allow others to support you.",
          action: "Practice one act of self-compassion today, whether it's rest, a warm bath, or gentle movement.",
        },
      ],
    },
    angry: {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      color: "from-red-100 to-pink-100",
      borderColor: "border-red-200",
      messages: [
        {
          title: "Transform Your Fire",
          verse: '"In your anger do not sin: Do not let the sun go down while you are still angry." - Ephesians 4:26',
          guidance:
            "Your anger signals that something important to you has been threatened. Channel this energy into positive action for justice and change, rather than destruction.",
          action: "Write down what triggered your anger and identify one constructive action you can take.",
        },
        {
          title: "Find Your Peace",
          verse: '"A gentle answer turns away wrath, but a harsh word stirs up anger." - Proverbs 15:1',
          guidance:
            "Your anger is valid, but how you express it matters. Take time to cool down before responding. Seek understanding rather than being understood first.",
          action: "Practice deep breathing for 2 minutes, then approach the situation with calmness.",
        },
        {
          title: "Righteous Purpose",
          verse: '"Be angry and do not sin; ponder in your own hearts on your beds, and be silent." - Psalm 4:4',
          guidance:
            "Sometimes anger reveals injustice that needs addressing. Use this energy to stand up for what's right, but do so with wisdom and love, not vengeance.",
          action: "Channel your anger into one positive action that addresses the root cause.",
        },
      ],
    },
    anxious: {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      color: "from-purple-100 to-violet-100",
      borderColor: "border-purple-200",
      messages: [
        {
          title: "Cast Your Worries",
          verse: '"Cast all your anxiety on him because he cares for you." - 1 Peter 5:7',
          guidance:
            "Your worries don't have to be carried alone. Release the need to control everything and trust in a greater plan. Focus on what you can influence today.",
          action: "Write down your worries and symbolically release them through prayer or meditation.",
        },
        {
          title: "Present Moment Peace",
          verse: '"Therefore do not worry about tomorrow, for tomorrow will worry about itself." - Matthew 6:34',
          guidance:
            "Anxiety often stems from future fears. Ground yourself in the present moment. What you need for today will be provided. Trust in this moment's sufficiency.",
          action:
            "Practice the 5-4-3-2-1 grounding technique: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
        },
        {
          title: "Strength in Stillness",
          verse: '"Be still, and know that I am God." - Psalm 46:10',
          guidance:
            "In the chaos of anxious thoughts, find stillness. Your worth isn't determined by your productivity or perfection. Rest in the knowledge that you are loved as you are.",
          action: "Spend 10 minutes in complete stillness, focusing only on your breath.",
        },
      ],
    },
    tired: {
      icon: <Coffee className="w-8 h-8 text-gray-600" />,
      color: "from-gray-100 to-slate-100",
      borderColor: "border-gray-200",
      messages: [
        {
          title: "Rest is Sacred",
          verse: '"He makes me lie down in green pastures, he leads me beside quiet waters." - Psalm 23:2',
          guidance:
            "Your exhaustion is a signal to rest, not push harder. True productivity comes from a rested mind and spirit. Give yourself permission to pause and recharge.",
          action: "Schedule 30 minutes of complete rest today - no devices, just peaceful restoration.",
        },
        {
          title: "Renewed Strength",
          verse: '"But those who hope in the Lord will renew their strength." - Isaiah 40:31',
          guidance:
            "Even eagles must rest between flights. Your current tiredness is preparing you for the next season of soaring. Trust in the process of renewal.",
          action: "Take a short walk in nature or practice gentle stretching to reconnect with your body.",
        },
        {
          title: "Gentle Progress",
          verse: '"My yoke is easy and my burden is light." - Matthew 11:30',
          guidance:
            "You don't have to carry everything at once. Break your tasks into smaller, manageable pieces. Progress, not perfection, is the goal.",
          action: "Choose just one small task to complete today and celebrate that accomplishment.",
        },
      ],
    },
    neutral: {
      icon: <Lightbulb className="w-8 h-8 text-green-600" />,
      color: "from-green-100 to-emerald-100",
      borderColor: "border-green-200",
      messages: [
        {
          title: "Embrace Balance",
          verse: '"For everything there is a season, and a time for every matter under heaven." - Ecclesiastes 3:1',
          guidance:
            "Your balanced state is a gift. Use this clarity to make thoughtful decisions and set intentions for growth. This is an ideal time for planning and reflection.",
          action: "Set one meaningful goal for the week and create a simple plan to achieve it.",
        },
        {
          title: "Steady Foundation",
          verse:
            '"Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock." - Matthew 7:24',
          guidance:
            "Your emotional stability provides a strong foundation for growth. Use this time to build healthy habits and strengthen relationships that matter.",
          action: "Establish one new positive habit that aligns with your values.",
        },
        {
          title: "Mindful Presence",
          verse: '"Whatever you do, work at it with all your heart." - Colossians 3:23',
          guidance:
            "Your calm state allows for deep presence and intentional living. Engage fully with whatever you're doing today, bringing mindfulness to ordinary moments.",
          action: "Practice mindful attention during one routine activity today.",
        },
      ],
    },
  }

  const currentMoodData = guidanceData[mood] || guidanceData.neutral
  const currentMessage = currentMoodData.messages[currentGuidanceIndex]

  // Auto-refresh guidance every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGuidanceIndex((prev) => (prev + 1) % currentMoodData.messages.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [currentMoodData.messages.length])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setCurrentGuidanceIndex((prev) => (prev + 1) % currentMoodData.messages.length)
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <Card className={`bg-gradient-to-br ${currentMoodData.color} border-2 ${currentMoodData.borderColor} shadow-lg`}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            {currentMoodData.icon}
            <h3 className="text-2xl font-bold text-gray-800">{currentMessage.title}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/50 hover:bg-white/70"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-4">
          <blockquote className="text-lg italic text-gray-700 border-l-4 border-gray-400 pl-4">
            {currentMessage.verse}
          </blockquote>

          <p className="text-gray-800 leading-relaxed">{currentMessage.guidance}</p>

          <div className="bg-white/60 rounded-lg p-4 border border-white/40">
            <h4 className="font-semibold text-gray-800 mb-2">Suggested Action:</h4>
            <p className="text-gray-700">{currentMessage.action}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {currentMoodData.messages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGuidanceIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentGuidanceIndex ? "bg-gray-600 w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
