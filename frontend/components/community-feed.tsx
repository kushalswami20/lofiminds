"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Send, Shield, Loader2, AlertCircle, User } from "lucide-react"

export default function CommunityFeed() {
  const [newPost, setNewPost] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")
  const [likingPosts, setLikingPosts] = useState(new Set())

  const moodOptions = [
    { emoji: "😊", label: "happy" },
    { emoji: "😔", label: "sad" },
    { emoji: "😠", label: "angry" },
    { emoji: "😰", label: "anxious" },
    { emoji: "😴", label: "tired" },
    { emoji: "😌", label: "calm" },
  ]

  // Get emoji for mood
  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find(m => m.label.toLowerCase() === mood?.toLowerCase())
    return moodOption ? moodOption.emoji : '😊'
  }

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setError("")
      
      const response = await fetch('http://localhost:5010/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data || [])
        // Optionally set the first user as default
        if (result.data && result.data.length > 0) {
          setCurrentUser(result.data[0]._id)
        }
      } else {
        throw new Error(result.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again later.')
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch('http://localhost:5010/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setPosts(result.data || [])
      } else {
        throw new Error(result.error || 'Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts. Please try again later.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Load users and posts on component mount
  useEffect(() => {
    fetchUsers()
    fetchPosts()
  }, [])

  // Handle creating a new post
  const handlePost = async () => {
    if (!newPost.trim() || !selectedMood || !currentUser) return

    try {
      setPosting(true)
      setError("")

      const response = await fetch('http://localhost:5010/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: currentUser,
          mood: selectedMood,
          content: newPost.trim(),
          supportive: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        // Add new post to the beginning of the posts array
        setPosts(prevPosts => [result.data, ...prevPosts])
        
        // Clear form
        setNewPost("")
        setSelectedMood("")
      } else {
        throw new Error(result.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  // Handle liking a post
  const handleLike = async (postId) => {
    if (likingPosts.has(postId)) return // Prevent multiple simultaneous likes

    try {
      setLikingPosts(prev => new Set(prev).add(postId))
      
      const response = await fetch(`http://localhost:5010/api/posts/${postId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          increment: true
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to like post: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        // Update the post in the posts array
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: result.data.likes }
              : post
          )
        )
      } else {
        throw new Error(result.error || 'Failed to like post')
      }
    } catch (error) {
      console.error('Error liking post:', error)
      setError('Failed to like post. Please try again.')
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  // Handle toggling supportive status
  const handleToggleSupportive = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5010/api/posts/${postId}/supportive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to toggle supportive: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        // Update the post in the posts array
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, supportive: result.data.supportive }
              : post
          )
        )
      } else {
        throw new Error(result.error || 'Failed to toggle supportive')
      }
    } catch (error) {
      console.error('Error toggling supportive:', error)
      setError('Failed to update post. Please try again.')
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  // Get user display name
  const getUserDisplayName = (userId) => {
    const user = users.find(u => u._id === userId)
    return user ? `${user.name} (${user.email})` : 'Anonymous'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Safe Space Community</h1>
        <p className="text-gray-600">Anonymous support and shared experiences</p>
      </div>

      {/* Community Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Community Guidelines</h3>
              <p className="text-sm text-blue-700">
                This is a safe, anonymous space for support. Be kind, respectful, and remember that everyone is on their
                own journey. No personal information is shared or stored.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError("")}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Creation */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Selection */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Select User (for demo purposes)</p>
            {usersLoading ? (
              <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading users...</span>
              </div>
            ) : (
              <select 
                value={currentUser || ""} 
                onChange={(e) => setCurrentUser(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={posting || users.length === 0}
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Mood Selection */}
          <div>
            <p className="text-sm text-gray-600 mb-3">How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.label}
                  variant={selectedMood === mood.label ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(mood.label)}
                  className="flex items-center space-x-2 text-sm"
                  disabled={posting}
                >
                  <span className="text-base">{mood.emoji}</span>
                  <span className="capitalize">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Post Content */}
          <div>
            <Textarea
              placeholder="Share what's on your mind... Remember, this is anonymous and safe."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-24 resize-none"
              disabled={posting}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {newPost.length}/500 characters
              </span>
              <div className="flex items-center space-x-4">
                {currentUser && (
                  <span className="text-xs text-gray-500">
                    Posting as: {getUserDisplayName(currentUser)}
                  </span>
                )}
                {selectedMood && (
                  <span className="text-xs text-gray-500">
                    Mood: {getMoodEmoji(selectedMood)} {selectedMood}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handlePost}
            disabled={!newPost.trim() || !selectedMood || !currentUser || posting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Share Anonymously
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Community Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {loading ? (
          <Card className="bg-white shadow-sm border">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading posts...</p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="bg-white shadow-sm border">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-2">No posts yet</p>
              <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post._id}
              className={`bg-white shadow-sm border transition-all duration-200 hover:shadow-md ${
                post.supportive ? "border-l-4 border-l-blue-400 bg-blue-50/30" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {getMoodEmoji(post.mood)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {post.user ? (typeof post.user === 'object' ? post.user.name : getUserDisplayName(post.user)) : 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {post.mood || 'Unknown mood'}
                      </span>
                      {post.supportive && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Supportive
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(post.createdAt)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-red-500 p-1"
                          onClick={() => handleLike(post._id)}
                          disabled={likingPosts.has(post._id)}
                        >
                          {likingPosts.has(post._id) ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Heart className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-sm">{post.likes || 0}</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-blue-500 p-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.replies || 0}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-blue-500 p-1"
                          onClick={() => handleToggleSupportive(post._id)}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Support Resources */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Need More Support?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-900">Crisis Resources</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• National Suicide Prevention Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
                <li>• SAMHSA Helpline: 1-800-662-4357</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-900">Campus Resources</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Student Counseling Services</li>
                <li>• Peer Support Groups</li>
                <li>• Academic Stress Workshops</li>
                <li>• Mental Health First Aid</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}