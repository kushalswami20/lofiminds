
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  User, 
  Brain, 
  Heart, 
  MessageCircle, 
  Star,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Search,
  CalendarDays,
  UserCheck,
  Target,
  FileText,
  Phone,
  Video,
  MapPin,
  Users,
  RefreshCw
} from "lucide-react"

export default function SessionBookingSystem() {
  // State management
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [view, setView] = useState('user-select') // 'user-select', 'dashboard', 'book', 'edit'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editingSession, setEditingSession] = useState(null)
  const [userPagination, setUserPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  })

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'Therapy',
    duration: 45,
    therapist: '',
    goal: '',
    notes: ''
  })

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    mood: 'neutral'
  })
  const [showNewUserForm, setShowNewUserForm] = useState(false)

  // Session types with icons and colors
  const sessionTypes = {
    'Therapy': {
      icon: MessageCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    'Meditation': {
      icon: Brain,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    'Coaching': {
      icon: Target,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  }

  // Status configurations
  const statusConfig = {
    'scheduled': {
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    'completed': {
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    'cancelled': {
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    },
    'in-progress': {
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50'
    }
  }

  // API call helper
  const makeApiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API call failed for ${url}:`, error)
      throw error
    }
  }

  // Fetch users from database
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setUsersLoading(true)
      setError("")
      
      const response = await makeApiCall(`http://localhost:5010/api/users?page=${page}&limit=${limit}`)
      
      if (response.success) {
        setUsers(response.data || [])
        setUserPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalUsers: response.totalUsers || 0,
          limit: limit
        })
      } else {
        throw new Error(response.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please ensure the backend server is running.')
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  // Create new user
  const createUser = async () => {
    if (!newUserForm.name || !newUserForm.email) {
      setError('Name and email are required fields')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await makeApiCall('http://localhost:5010/api/users', {
        method: 'POST',
        body: JSON.stringify(newUserForm),
      })

      if (response.success) {
        setSuccess('User created successfully!')
        setNewUserForm({ name: '', email: '', mood: 'neutral' })
        setShowNewUserForm(false)
        await fetchUsers() // Refresh user list
      }
    } catch (error) {
      setError(error.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const response = await makeApiCall(`http://localhost:5010/api/users/${userId}`)
      return response.success ? response.data : null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  // Update user
  const updateUser = async (userId, userData) => {
    try {
      const response = await makeApiCall(`http://localhost:5010/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      })
      return response.success
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    setLoading(true)
    try {
      const response = await makeApiCall(`http://localhost:5010/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.success) {
        setSuccess('User deleted successfully!')
        await fetchUsers() // Refresh user list
      }
    } catch (error) {
      setError(error.message || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user sessions
  const fetchSessions = async () => {
    if (!currentUser) return

    setLoading(true)
    setError('')
    try {
      const response = await makeApiCall(`http://localhost:5010/api/sessions/user/${currentUser._id}`)
      const sessionsData = response.data || []
      setSessions(sessionsData)
      setFilteredSessions(sessionsData)
    } catch (error) {
      setError('Failed to fetch sessions')
      setSessions([])
      setFilteredSessions([])
    } finally {
      setLoading(false)
    }
  }

  // Create new session
  const createSession = async () => {
    if (!formData.date || !formData.time || !formData.type) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const sessionDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const sessionData = {
        user: currentUser._id,
        date: sessionDateTime.toISOString(),
        type: formData.type,
        duration: parseInt(formData.duration),
        therapist: formData.therapist.trim(),
        goal: formData.goal.trim(),
        notes: formData.notes.trim(),
        status: 'scheduled'
      }

      const response = await makeApiCall('http://localhost:5010/api/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      })

      setSuccess('Session booked successfully!')
      setView('dashboard')
      resetForm()
      await fetchSessions()
      
    } catch (error) {
      setError(error.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  // Update session
  const updateSession = async () => {
    if (!editingSession || !formData.date || !formData.time || !formData.type) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const sessionDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const sessionData = {
        date: sessionDateTime.toISOString(),
        type: formData.type,
        duration: parseInt(formData.duration),
        therapist: formData.therapist.trim(),
        goal: formData.goal.trim(),
        notes: formData.notes.trim()
      }

      const response = await makeApiCall(`http://localhost:5010/api/sessions/${editingSession._id}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData),
      })

      setSuccess('Session updated successfully!')
      setView('dashboard')
      setEditingSession(null)
      resetForm()
      await fetchSessions()
      
    } catch (error) {
      setError(error.message || 'Failed to update session')
    } finally {
      setLoading(false)
    }
  }

  // Delete session
  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await makeApiCall(`http://localhost:5010/api/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      setSuccess('Session deleted successfully!')
      await fetchSessions()
      
    } catch (error) {
      setError(error.message || 'Failed to delete session')
    } finally {
      setLoading(false)
    }
  }

  // Update session status
  const updateSessionStatus = async (sessionId, newStatus) => {
    setLoading(true)
    setError('')
    
    try {
      await makeApiCall(`http://localhost:5010/api/sessions/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })

      setSuccess(`Session ${newStatus} successfully!`)
      await fetchSessions()
      
    } catch (error) {
      setError(error.message || 'Failed to update session status')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      type: 'Therapy',
      duration: 45,
      therapist: '',
      goal: '',
      notes: ''
    })
  }

  // Handle edit
  const handleEdit = (session) => {
    const sessionDate = new Date(session.date)
    const dateStr = sessionDate.toISOString().split('T')[0]
    const timeStr = sessionDate.toTimeString().substr(0, 5)
    
    setFormData({
      date: dateStr,
      time: timeStr,
      type: session.type,
      duration: session.duration,
      therapist: session.therapist || '',
      goal: session.goal || '',
      notes: session.notes || ''
    })
    setEditingSession(session)
    setView('edit')
  }

  // Filter sessions
  const filterSessions = () => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.therapist && session.therapist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.goal && session.goal.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.type === typeFilter)
    }

    setFilteredSessions(filtered)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get session stats
  const getStats = () => {
    const total = sessions.length
    const scheduled = sessions.filter(s => s.status === 'scheduled').length
    const completed = sessions.filter(s => s.status === 'completed').length
    const cancelled = sessions.filter(s => s.status === 'cancelled').length
    
    return { total, scheduled, completed, cancelled }
  }

  // Effects
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchSessions()
    }
  }, [currentUser])

  useEffect(() => {
    filterSessions()
  }, [searchTerm, statusFilter, typeFilter, sessions])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // User Selection View
  if (view === 'user-select') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Booking System</h1>
          <p className="text-gray-600">Select a user to manage their sessions</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users ({userPagination.totalUsers})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => fetchUsers(userPagination.currentPage)}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={() => setShowNewUserForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* New User Form */}
            {showNewUserForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Name"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  />
                  <select
                    value={newUserForm.mood}
                    onChange={(e) => setNewUserForm({...newUserForm, mood: e.target.value})}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="anxious">Anxious</option>
                    <option value="depressed">Depressed</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={createUser}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create User
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewUserForm(false)
                      setNewUserForm({ name: '', email: '', mood: 'neutral' })
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {usersLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
                <p className="text-sm">Create your first user to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <Badge className="mt-1" variant="outline">
                            {user.mood}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setCurrentUser(user)
                            setView('dashboard')
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          View Sessions
                        </Button>
                        <Button
                          onClick={() => deleteUser(user._id)}
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {userPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  onClick={() => fetchUsers(userPagination.currentPage - 1)}
                  disabled={userPagination.currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {userPagination.currentPage} of {userPagination.totalPages}
                </span>
                <Button
                  onClick={() => fetchUsers(userPagination.currentPage + 1)}
                  disabled={userPagination.currentPage === userPagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                onClick={() => setView('user-select')}
                variant="outline"
                size="sm"
              >
                ← Back to Users
              </Button>
              <Badge variant="outline" className="ml-2">
                {currentUser?.name}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600">Manage your therapy, meditation, and coaching sessions</p>
          </div>
          <Button
            onClick={() => setView('book')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book New Session
          </Button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.scheduled}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Cancelled</p>
                  <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="in-progress">In Progress</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="Therapy">Therapy</option>
                <option value="Meditation">Meditation</option>
                <option value="Coaching">Coaching</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Sessions ({filteredSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Loading sessions...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions found</p>
                <p className="text-sm">Book your first session to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => {
                  const TypeIcon = sessionTypes[session.type]?.icon || Calendar
                  const StatusIcon = statusConfig[session.status]?.icon || Clock
                  
                  return (
                    <div key={session._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${sessionTypes[session.type]?.bgColor}`}>
                              <TypeIcon className={`w-5 h-5 ${sessionTypes[session.type]?.textColor}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{session.type}</h3>
                              <p className="text-sm text-gray-600">{formatDate(session.date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(session.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {session.duration} min
                            </span>
                            {session.therapist && (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-4 h-4" />
                                {session.therapist}
                              </span>
                            )}
                          </div>

                          {session.goal && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <Target className="w-4 h-4 inline mr-1" />
                                Goal: {session.goal}
                              </p>
                            </div>
                          )}

                          {session.notes && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-700">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Notes: {session.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Badge className={`${statusConfig[session.status]?.bgColor} ${statusConfig[session.status]?.textColor}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {session.status}
                            </Badge>
                            {session.sessionRating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{session.sessionRating}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleEdit(session)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                          {session.status === 'scheduled' && (
                            <div className="flex gap-1">
                              <Button
                                onClick={() => updateSessionStatus(session._id, 'completed')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs"
                              >
                                Complete
                              </Button>
                              <Button
                                onClick={() => updateSessionStatus(session._id, 'cancelled')}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => deleteSession(session._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Book/Edit Session View
  if (view === 'book' || view === 'edit') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {view === 'book' ? 'Book New Session' : 'Edit Session'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(sessionTypes).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <div
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{type}</h3>
                          <p className="text-sm text-gray-600">
                            {type === 'Therapy' && 'Professional counseling session'}
                            {type === 'Meditation' && 'Guided mindfulness practice'}
                            {type === 'Coaching' && 'Goal-oriented guidance'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>

            {/* Therapist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Therapist/Coach (Optional)
              </label>
              <Input
                placeholder="Enter therapist or coach name"
                value={formData.therapist}
                onChange={(e) => setFormData({ ...formData, therapist: e.target.value })}
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Goal (Optional)
              </label>
              <Input
                placeholder="What would you like to achieve in this session?"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Any additional notes or preparation needed..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-md resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setView('dashboard')
                  setEditingSession(null)
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={view === 'book' ? createSession : updateSession}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {view === 'book' ? 'Book Session' : 'Update Session'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}