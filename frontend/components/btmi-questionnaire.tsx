"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, RotateCcw, AlertCircle, Users, Shield, Eye, Star, Lightbulb } from "lucide-react"

interface BTMIProps {
  mood: string
}

interface Question {
  id: number
  text: string
  factor: string
  options: { value: number; label: string }[]
}

interface Results {
  totalScore: number
  maxScore: number
  stigmaLevel: string
  interpretation: string
  factorScores: { [key: string]: { score: number; maxScore: number } }
  recommendations: string[]
  encouragement: string
}

export function BTMIQuestionnaire({ mood }: BTMIProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)

  const questions: Question[] = [
    // Factor 1: Dangerousness
    {
      id: 1,
      text: "People with mental illness are dangerous.",
      factor: "Dangerousness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 2,
      text: "Mental illness makes people unpredictable.",
      factor: "Dangerousness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 3,
      text: "I would be afraid to talk with someone who has a mental illness.",
      factor: "Dangerousness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 4,
      text: "People with mental illness scare me.",
      factor: "Dangerousness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 5,
      text: "I would feel unsafe around someone with schizophrenia.",
      factor: "Dangerousness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    // Factor 2: Poor Social Skills
    {
      id: 6,
      text: "People with mental illness are less able to make friends.",
      factor: "Poor Social Skills",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 7,
      text: "Mental illness makes it difficult for people to work with others.",
      factor: "Poor Social Skills",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 8,
      text: "Individuals with mental illness are hard to talk to.",
      factor: "Poor Social Skills",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 9,
      text: "I would not enjoy being around someone with a mental illness.",
      factor: "Poor Social Skills",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 10,
      text: "Mental illness prevents people from being good employees.",
      factor: "Poor Social Skills",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    // Factor 3: Incurability & Weakness
    {
      id: 11,
      text: "Mental illness is a sign of personal weakness.",
      factor: "Incurability & Weakness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 12,
      text: "People with mental illness cannot recover.",
      factor: "Incurability & Weakness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 13,
      text: "Once someone has a mental illness, they will never be normal again.",
      factor: "Incurability & Weakness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 14,
      text: "Therapy or medication cannot really help those with mental illness.",
      factor: "Incurability & Weakness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 15,
      text: "People with mental illness are permanently damaged.",
      factor: "Incurability & Weakness",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    // Factor 4: Shame and Avoidance
    {
      id: 16,
      text: "I would feel embarrassed if a family member had a mental illness.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 17,
      text: "I would not marry someone who had a history of mental illness.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 18,
      text: "I would not want others to know if I had a mental illness.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 19,
      text: "I would avoid telling a friend if I were diagnosed with mental illness.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 20,
      text: "Mental illness should be kept secret within the family.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 21,
      text: "People with mental illness should be kept in hospitals.",
      factor: "Shame and Avoidance",
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
  ]

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = 105 // 21 questions × 5 points each

    let stigmaLevel = ""
    let interpretation = ""
    let encouragement = ""
    let recommendations: string[] = []

    // Based on your exact measurement scale
    if (totalScore >= 21 && totalScore <= 41) {
      stigmaLevel = "Low Stigma"
      interpretation =
        "🌟 You demonstrate positive and compassionate beliefs about mental illness. Your understanding shows empathy and acceptance, which helps create a supportive environment for those experiencing mental health challenges."
      encouragement =
        "Your positive attitude is a beacon of hope! Continue being an advocate for mental health awareness and help others develop the same understanding and compassion you've shown."
      recommendations = [
        "🌱 Continue sharing your positive perspective to help reduce stigma in your community",
        "📚 Consider volunteering with mental health organizations to amplify your impact",
        "💬 Use your understanding to support friends and family who may be struggling",
        "🎯 Help educate others by sharing factual information about mental health",
        "✨ Your empathy makes a real difference - keep being a source of support for others",
      ]
    } else if (totalScore >= 42 && totalScore <= 73) {
      stigmaLevel = "Moderate Stigma"
      interpretation =
        "💭 You have some mixed beliefs about mental illness. While you show understanding in some areas, there are opportunities to develop more empathetic and informed perspectives. This is completely normal and shows room for growth."
      encouragement =
        "You're on a journey of understanding, and that's beautiful! Every step toward greater empathy and knowledge makes a difference. Your willingness to learn shows your caring heart."
      recommendations = [
        "📖 Explore reputable mental health resources to deepen your understanding",
        "👥 Consider connecting with mental health advocates or support groups",
        "🧠 Practice mindfulness about your thoughts and reactions to mental health topics",
        "💝 Remember that everyone's mental health journey is unique and valid",
        "🌈 Celebrate small steps in changing perspectives - growth takes time",
        "🤝 Engage with stories of recovery and resilience to broaden your perspective",
      ]
    } else {
      stigmaLevel = "High Stigma"
      interpretation =
        "🤝 Your responses suggest some strongly held beliefs about mental illness that may benefit from gentle exploration and learning. Remember, changing perspectives is a sign of growth, not weakness."
      encouragement =
        "Thank you for taking this assessment - it shows courage and openness to self-reflection. Everyone starts somewhere, and your willingness to learn is the first step toward greater understanding and compassion."
      recommendations = [
        "🤗 Approach learning about mental health with curiosity rather than judgment",
        "📚 Seek information from mental health professionals and reputable sources",
        "💭 Reflect on how your beliefs might affect others and their willingness to seek help",
        "🌟 Remember that mental health conditions are medical conditions, not character flaws",
        "🤝 Consider speaking with a counselor to explore your feelings and beliefs",
        "💪 Recognize that changing long-held beliefs takes courage and time",
        "🌱 Start small - even tiny shifts in perspective can make a big difference",
      ]
    }

    // Calculate factor scores
    const factorScores: { [key: string]: { score: number; maxScore: number } } = {}
    const factors = ["Dangerousness", "Poor Social Skills", "Incurability & Weakness", "Shame and Avoidance"]

    factors.forEach((factor) => {
      const factorQuestions = questions.filter((q) => q.factor === factor)
      const factorScore = factorQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)
      factorScores[factor] = {
        score: factorScore,
        maxScore: factorQuestions.length * 5,
      }
    })

    setResults({
      totalScore,
      maxScore,
      stigmaLevel,
      interpretation,
      factorScores,
      recommendations,
      encouragement,
    })
    setShowResults(true)
  }

  const resetQuestionnaire = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setResults(null)
  }

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "Dangerousness":
        return <AlertCircle className="w-5 h-5" />
      case "Poor Social Skills":
        return <Users className="w-5 h-5" />
      case "Incurability & Weakness":
        return <Shield className="w-5 h-5" />
      case "Shame and Avoidance":
        return <Eye className="w-5 h-5" />
      default:
        return <Brain className="w-5 h-5" />
    }
  }

  const getStigmaColor = (level: string) => {
    switch (level) {
      case "Low Stigma":
        return "text-green-600 bg-green-100"
      case "Moderate Stigma":
        return "text-yellow-600 bg-yellow-100"
      case "High Stigma":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-800">Your BTMI Assessment Results</CardTitle>
            <p className="text-gray-600 mt-2">Thank you for completing the Beliefs Toward Mental Illness assessment</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Overall Score */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-5xl font-bold text-purple-600">
                  {results.totalScore}
                  <span className="text-2xl text-gray-500">/{results.maxScore}</span>
                </div>
                <Badge className={`text-xl px-6 py-3 ${getStigmaColor(results.stigmaLevel)}`}>
                  {results.stigmaLevel}
                </Badge>
                <div className="max-w-md mx-auto">
                  <Progress value={(results.totalScore / results.maxScore) * 100} className="h-4" />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>21 (Low)</span>
                    <span>41</span>
                    <span>73</span>
                    <span>105 (High)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-gray-700 text-lg leading-relaxed">{results.interpretation}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Words of Encouragement</h3>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-700 text-center">{results.encouragement}</p>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center flex items-center justify-center space-x-2">
                <Brain className="w-6 h-6" />
                <span>Detailed Factor Analysis</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(results.factorScores).map(([factor, scores]) => (
                  <Card key={factor} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {getFactorIcon(factor)}
                        <h4 className="font-semibold text-sm">{factor}</h4>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-purple-600">{scores.score}</span>
                        <span className="text-sm text-gray-600">/ {scores.maxScore}</span>
                      </div>
                      <Progress value={(scores.score / scores.maxScore) * 100} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center flex items-center justify-center space-x-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <span>Your Personalized Growth Path</span>
              </h3>
              <div className="grid gap-4">
                {results.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={resetQuestionnaire}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Assessment Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span>BTMI Assessment</span>
            </CardTitle>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Badge className="bg-purple-100 text-purple-800 mt-1">{currentQ.factor}</Badge>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{currentQ.text}</h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <Button
                key={option.value}
                variant={answers[currentQ.id] === option.value ? "default" : "outline"}
                className={`w-full justify-start text-left p-4 h-auto ${
                  answers[currentQ.id] === option.value
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "hover:bg-purple-50"
                }`}
                onClick={() => handleAnswer(currentQ.id, option.value)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQ.id] === option.value ? "bg-white border-white" : "border-gray-300"
                    }`}
                  >
                    {answers[currentQ.id] === option.value && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <span>Previous</span>
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id]}
              className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
            >
              <span>{currentQuestion === questions.length - 1 ? "View Results" : "Next"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-purple-800">About BTMI Assessment</h4>
            <p className="text-sm text-purple-700">
              The Beliefs Toward Mental Illness (BTMI) scale measures attitudes and stigma toward mental health
              conditions. Your responses help identify areas for growth in understanding and empathy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}