// userController.js
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new user
export const createUser = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Validate required fields
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ 
        error: 'name and email are required fields' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ 
      error: err.message,
      details: err.errors || null
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('name email mood createdAt') // Only return necessary fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      data: users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(userId).select('name email mood createdAt');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    // Check if email is being updated and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'User with this email already exists' 
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      req.body, 
      { new: true, runValidators: true }
    ).select('name email mood createdAt');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ 
      error: err.message 
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Get users by mood
export const getUsersByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const users = await User.find({ mood })
      .select('name email mood createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments({ mood });
    
    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      data: users
    });
  } catch (err) {
    console.error('Error fetching users by mood:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};