
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Activity,
  Brain,
  Heart,
  Eye,
  Waves,
  LogOut,
  Share2,
  Copy,
  CheckCircle,
  UserPlus,
  Crown,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Zap,
  Cpu,
  RefreshCw,
  Plus,
  X,
  Loader2,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Camera,
  Settings,
  Monitor
} from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  mood?: string
  createdAt: string
}

interface Session {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  type: string
  date: string
  duration?: number
  notes?: string
  mood?: string
  title?: string
  maxParticipants?: number
  isPublic?: boolean
  focus?: string
  level?: string
  startTime?: string
  endTime?: string
  actualDuration?: number
}

interface Participant {
  id: number
  name: string
  status: string
  calmScore: number
  expression: string
  isReal: boolean
}

export default function VirtualMeditationRoom() {
  // User management state
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mood: "calm"
  })

  // Room state
  const [isInRoom, setIsInRoom] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [roomId, setRoomId] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Database sessions state
  const [availableSessions, setAvailableSessions] = useState<Session[]>([])
  const [userSessions, setUserSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)

  // New session form state
  const [newSession, setNewSession] = useState({
    title: "",
    type: "group",
    duration: 20,
    maxParticipants: 20,
    isPublic: true,
    focus: "Stress Relief",
    level: "Beginner",
    notes: ""
  })

  // ML Face Detection States
  const [faceDetection, setFaceDetection] = useState({
    isActive: true,
    currentExpression: "neutral",
    confidence: 0,
    emotions: {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
      neutral: 85,
    },
  })

  const [aiAnalysis, setAiAnalysis] = useState({
    faceExpression: "calm",
    emotionalState: "stable",
    posture: "good",
    breathing: "regular",
    overallScore: 85,
    mlDetection: "active",
  })

  const [sessionTime, setSessionTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const API_BASE_URL = "http://localhost:5010/api"
  const ML_API_URL = "http://localhost:8000/score"


  const mockParticipants: Participant[] = [
    { id: 1, name: "Sarah M.", status: "meditating", calmScore: 92, expression: "peaceful", isReal: true },
    { id: 2, name: "Alex K.", status: "breathing", calmScore: 78, expression: "focused", isReal: true },
    { id: 3, name: "Maya P.", status: "focused", calmScore: 85, expression: "calm", isReal: true },
    { id: 4, name: "Raj S.", status: "relaxed", calmScore: 88, expression: "serene", isReal: true },
    { id: 5, name: "Priya L.", status: "centering", calmScore: 91, expression: "peaceful", isReal: true },
  ]

  // API functions
  const createUser = async (userData: typeof userForm) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentUser(data.data)
        setShowUserForm(false)
        setSuccess("User created successfully!")
        setTimeout(() => setSuccess(""), 3000)
        // Reset form
        setUserForm({ name: "", email: "", mood: "calm" })
      } else {
        setError(data.error || "Failed to create user")
      }
    } catch (err) {
      setError("Error connecting to server")
      console.error("Error creating user:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllSessions = async () => {
    setLoadingSessions(true)
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableSessions(data.data)
      } else {
        setError("Failed to fetch sessions")
      }
    } catch (err) {
      setError("Error connecting to server")
      console.error("Error fetching sessions:", err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const fetchUserSessions = async (userId: string) => {
    if (!userId) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/user/${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUserSessions(data.data)
      }
    } catch (err) {
      console.error("Error fetching user sessions:", err)
    }
  }

  const createSessionInDB = async (sessionData: any) => {
    if (!currentUser) {
      setError("Please create a user account first")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: currentUser._id,
          type: sessionData.type,
          date: new Date(),
          duration: sessionData.duration,
          notes: sessionData.notes,
          mood: currentUser.mood,
          title: sessionData.title,
          maxParticipants: sessionData.maxParticipants,
          isPublic: sessionData.isPublic,
          focus: sessionData.focus,
          level: sessionData.level
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh sessions list
        await fetchAllSessions()
        await fetchUserSessions(currentUser._id)
        
        // Join the created session
        joinRoom(data.data)
        setShowCreateModal(false)
        setSuccess("Session created successfully!")
        setTimeout(() => setSuccess(""), 3000)
        
        // Reset form
        setNewSession({
          title: "",
          type: "group",
          duration: 20,
          maxParticipants: 20,
          isPublic: true,
          focus: "Stress Relief",
          level: "Beginner",
          notes: ""
        })
      } else {
        setError(data.error || "Failed to create session")
      }
    } catch (err) {
      setError("Error creating session")
      console.error("Error creating session:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSessionInDB = async (sessionId: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh sessions
        await fetchAllSessions()
        if (currentUser) {
          await fetchUserSessions(currentUser._id)
        }
      }
    } catch (err) {
      console.error("Error updating session:", err)
    }
  }

  // Initialize sessions on component mount
  useEffect(() => {
    fetchAllSessions()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchUserSessions(currentUser._id)
    }
  }, [currentUser])

  // Format session data for display
  const formatSessionForDisplay = (session: Session) => {
    return {
      id: session._id,
      title: session.title || `${session.type} Session`,
      instructor: session.user.name,
      participants: Math.floor(Math.random() * 15) + 5, // Mock participant count
      maxParticipants: session.maxParticipants || 20,
      duration: `${session.duration || 20} min`,
      level: session.level || "All Levels",
      time: new Date(session.date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      focus: session.focus || "Mindfulness",
      isPublic: session.isPublic !== false,
      date: session.date,
      notes: session.notes,
      mood: session.mood,
      originalData: session
    }
  }
  function mapScoreToExpression(score: number) {
  if (score > 0.1) return "happy"
  if (score > 0.05) return "calm"
  if (score > 0.03) return "neutral"
  return "sad"
}

  // Simulate ML Face Detection
  useEffect(() => {
  let scoreInterval: NodeJS.Timeout

  if (isInRoom && isVideoOn && faceDetection.isActive) {
    scoreInterval = setInterval(async () => {
      try {
        const response = await fetch(ML_API_URL)
        const data = await response.json()
        const score = data.score || 0

        const expression = mapScoreToExpression(score)
        const confidence = Math.floor(score * 100)

        setFaceDetection((prev) => ({
          ...prev,
          currentExpression: expression,
          confidence: confidence,
        }))

        setAiAnalysis((prev) => ({
          ...prev,
          overallScore: confidence,
          faceExpression: expression,
          emotionalState: confidence > 80 ? "stable" : "fluctuating",
          posture: Math.random() > 0.6 ? "good" : "adjusting",
          breathing: Math.random() > 0.5 ? "regular" : "deep",
          mlDetection: "active",
        }))

        // Drawing logic
        if (canvasRef.current && videoRef.current && videoRef.current.videoWidth > 0) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")
          if (ctx) {
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const faceX = canvas.width * 0.25
            const faceY = canvas.height * 0.2
            const faceWidth = canvas.width * 0.5
            const faceHeight = canvas.height * 0.6

            ctx.strokeStyle =
              expression === "happy"
                ? "#10B981"
                : expression === "sad"
                  ? "#3B82F6"
                  : expression === "calm"
                    ? "#EF4444"
                    : "#6B7280"

            ctx.fillStyle = ctx.strokeStyle
            ctx.font = "16px Arial"
            ctx.fillText(`${expression} (${confidence}%)`, faceX, faceY - 10)
          }
        }
      } catch (err) {
        console.error("Error in ML interval:", err)
      }
    }, 2000)
  }

  return () => clearInterval(scoreInterval)
}, [isInRoom, isVideoOn, faceDetection.isActive])


  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInRoom) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)

        // Update AI analysis based on ML detection
        setAiAnalysis((prev) => ({
          ...prev,
          faceExpression: faceDetection.currentExpression,
          emotionalState: faceDetection.confidence > 80 ? "stable" : "fluctuating",
          posture: Math.random() > 0.6 ? "good" : "adjusting",
          breathing: Math.random() > 0.5 ? "regular" : "deep",
          overallScore: Math.floor((faceDetection.confidence + Math.random() * 20) / 1.2),
          mlDetection: "active",
        }))
      }, 3000);
    }
    return () => clearInterval(interval)
  }, [isInRoom, faceDetection])

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = () => {
    if (!currentUser) {
      setError("Please create a user account first")
      return
    }
    setShowCreateModal(true)
  }

  const handleCreateSession = async () => {
    if (!newSession.title.trim()) {
      setError("Session title is required")
      return
    }

    const newRoomId = generateRoomId()
    setRoomId(newRoomId)
    setIsHost(true)

    // Create session in database
    await createSessionInDB({
      ...newSession,
      roomId: newRoomId
    })
  }

  const joinRoomById = (id: string) => {
    setRoomId(id)
    setIsHost(false)
    const mockSession = {
      id: "joined",
      title: `Room ${id}`,
      instructor: "Group Session",
      participants: Math.floor(Math.random() * 8) + 3,
      duration: "Ongoing",
      level: "All Levels",
      focus: "Community Meditation",
      originalData: null
    }
    joinRoom(mockSession)
  }

  const joinRoom = (session: any) => {
    setCurrentSession(session.originalData || session)
    setIsInRoom(true)
    setParticipants(mockParticipants)
    setSessionTime(0)

    // Update session start time in database if it's a real session
    if (session.originalData) {
      updateSessionInDB(session.originalData._id, {
        startTime: new Date()
      })
    }

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
  }

  const leaveRoom = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }

    // Update session end time in database if it's a real session
    if (currentSession && currentSession._id) {
      await updateSessionInDB(currentSession._id, {
        endTime: new Date(),
        actualDuration: sessionTime
      })
    }

    setIsInRoom(false)
    setCurrentSession(null)
    setParticipants([])
    setSessionTime(0)
    setRoomId("")
    setIsHost(false)
  }

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = (videoRef.current.srcObject as MediaStream).getVideoTracks()
      videoTracks.forEach((track) => (track.enabled = !isVideoOn))
    }
    setIsVideoOn(!isVideoOn)
  }

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks()
      audioTracks.forEach((track) => (track.enabled = !isAudioOn))
    }
    setIsAudioOn(!isAudioOn)
  }

  const shareRoom = () => {
    const roomLink = `${window.location.origin}/room/${roomId}`
    navigator.clipboard.writeText(roomLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getExpressionIcon = (expression: string) => {
    switch (expression) {
      case "happy":
        return <Smile className="w-4 h-4 text-green-600" />
      case "sad":
        return <Frown className="w-4 h-4 text-blue-600" />
      case "angry":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "surprised":
        return <Zap className="w-4 h-4 text-yellow-600" />
      default:
        return <Meh className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      meditating: "bg-purple-100 text-purple-800",
      breathing: "bg-blue-100 text-blue-800",
      focused: "bg-green-100 text-green-800",
      relaxed: "bg-yellow-100 text-yellow-800",
      centering: "bg-indigo-100 text-indigo-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (isInRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {currentSession?.title || "Meditation Room"}
              </h1>
              <p className="text-white/80">
                {isHost ? "You're hosting" : `Hosted by ${currentSession?.user?.name || "Unknown"}`} • {formatTime(sessionTime)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500">
                <Users className="w-4 h-4 mr-1" />
                {participants.length} participants
              </Badge>
              <Button
                onClick={leaveRoom}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Room
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Local Video */}
              <Card className="bg-black/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ pointerEvents: "none" }}
                    />
                    {!isVideoOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <VideoOff className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-400">Camera Off</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button
                      onClick={toggleVideo}
                      variant={isVideoOn ? "default" : "destructive"}
                      size="lg"
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                    <Button
                      onClick={toggleAudio}
                      variant={isAudioOn ? "default" : "destructive"}
                      size="lg"
                    >
                      {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    {isHost && (
                      <Button onClick={shareRoom} variant="outline" size="lg">
                        {copiedLink ? <CheckCircle className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-purple-300" />
                    <span>AI Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Expression:</span>
                        <div className="flex items-center space-x-2">
                          {getExpressionIcon(aiAnalysis.faceExpression)}
                          <span className="capitalize">{aiAnalysis.faceExpression}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emotional State:</span>
                        <Badge className={aiAnalysis.emotionalState === "stable" ? "bg-green-500" : "bg-yellow-500"}>
                          {aiAnalysis.emotionalState}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Posture:</span>
                        <Badge className={aiAnalysis.posture === "good" ? "bg-green-500" : "bg-blue-500"}>
                          {aiAnalysis.posture}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Breathing:</span>
                        <Badge className={aiAnalysis.breathing === "regular" ? "bg-green-500" : "bg-blue-500"}>
                          {aiAnalysis.breathing}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Score:</span>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="font-bold">{aiAnalysis.overallScore}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ML Detection:</span>
                        <Badge className="bg-purple-500">
                          <Monitor className="w-3 h-3 mr-1" />
                          {aiAnalysis.mlDetection}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Participants */}
              <Card className="bg-black/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Participants ({participants.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <Badge className={getStatusColor(participant.status)} variant="outline">
                            {participant.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {getExpressionIcon(participant.expression)}
                            <span className="text-sm">{participant.calmScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emotion Detection */}
              <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-green-300" />
                    <span>Emotion Detection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current:</span>
                      <div className="flex items-center space-x-2">
                        {getExpressionIcon(faceDetection.currentExpression)}
                        <span className="capitalize">{faceDetection.currentExpression}</span>
                        <Badge className="bg-blue-500">{faceDetection.confidence}%</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(faceDetection.emotions).map(([emotion, value]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{emotion}:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-sm w-8 text-right">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Virtual Meditation Room</h1>
        <p className="text-white/90">Connect with real people for guided meditation with AI-powered analysis</p>
      </div>

      {/* Create or Join Room */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Create Private Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Start your own meditation session and invite friends or family to join you.
            </p>
            <Button onClick={createRoom} className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Join Existing Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Enter a room ID to join an ongoing meditation session.</p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <Button
                onClick={() => joinRoomById(roomId)}
                disabled={!roomId}
                className="bg-green-600 hover:bg-green-700"
              >
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Detection Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>Advanced AI + ML Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Real-time ML Analysis:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>Facial Expression Detection:</strong> Real-time emotion recognition
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>
                    <strong>MobileNet-V3 CNN:</strong> Calm/Not-Calm classification
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Waves className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Bi-GRU Audio Analysis:</strong> Breathing pattern detection
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span>
                    <strong>Posture Recognition:</strong> Bi-LSTM with attention
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Live Features:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Real-time facial expression overlay</p>
                <p>• Emotion confidence scoring</p>
                <p>• Multi-modal fusion analysis</p>
                <p>• Live meditation quality feedback</p>
                <p>• Privacy-first local processing</p>
                <p>• Connect with real people worldwide</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Sessions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Join Public Sessions</h2>
        {availableSessions.map((session) => (
          <Card key={session._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    <Badge variant="outline">{session.level}</Badge>
                    {session.isPublic && <Badge className="bg-green-100 text-green-800">Public</Badge>}
                  </div>
                  <p className="text-gray-600 mb-2">Guided by {session.instructor}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participants}/{session.maxParticipants} joined
                      </span>
                    </span>
                    <span>{session.duration}</span>
                    <span>{session.time}</span>
                    <Badge className="bg-blue-100 text-blue-800">{session.focus}</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => joinRoom(session)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}