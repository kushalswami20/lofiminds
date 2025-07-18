// Post Controller (postController.js)
import Post from '../models/Post.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    // Validate required fields
    if (!req.body.user || !req.body.content) {
      return res.status(400).json({ 
        error: 'user and content are required fields' 
      });
    }

    // Validate user ID format
    if (!mongoose.isValidObjectId(req.body.user)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    const post = await Post.create(req.body);
    
    // Populate user details in response
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name email mood');
    
    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ 
      error: err.message,
      details: err.errors || null
    });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, mood, supportive } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (mood) filter.mood = mood;
    if (supportive !== undefined) filter.supportive = supportive === 'true';
    
    const posts = await Post.find(filter)
      .populate('user', 'name email mood')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      data: posts
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ 
        error: 'Invalid post ID format' 
      });
    }

    const post = await Post.findById(postId)
      .populate('user', 'name email mood');
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get posts by user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    const posts = await Post.find({ user: userId })
      .populate('user', 'name email mood')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({ user: userId });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      data: posts
    });
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ 
        error: 'Invalid post ID format' 
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('user', 'name email mood');
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(400).json({ 
      error: err.message 
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ 
        error: 'Invalid post ID format' 
      });
    }

    const post = await Post.findByIdAndDelete(postId);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { increment = true } = req.body; // true to like, false to unlike
    
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ 
        error: 'Invalid post ID format' 
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: increment ? 1 : -1 } },
      { new: true }
    ).populate('user', 'name email mood');
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Toggle supportive status
export const toggleSupportive = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ 
        error: 'Invalid post ID format' 
      });
    }

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    post.supportive = !post.supportive;
    await post.save();
    
    await post.populate('user', 'name email mood');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Error toggling supportive:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get posts by mood
export const getPostsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ mood })
      .populate('user', 'name email mood')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({ mood });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      data: posts
    });
  } catch (err) {
    console.error('Error fetching posts by mood:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get supportive posts
export const getSupportivePosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ supportive: true })
      .populate('user', 'name email mood')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPosts = await Post.countDocuments({ supportive: true });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      data: posts
    });
  } catch (err) {
    console.error('Error fetching supportive posts:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};