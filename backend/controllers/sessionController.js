// Sessions Controller (fixed version)
import Session from '../models/Sessions.js';
import mongoose from 'mongoose';

export const createSession = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    // Validate required fields
    if (!req.body.user || !req.body.type) {
      return res.status(400).json({ 
        error: 'user and type are required fields' 
      });
    }

    // Validate user ID format
    if (!mongoose.isValidObjectId(req.body.user)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    // Set default date if not provided
    if (!req.body.date) {
      req.body.date = new Date();
    }

    const session = await Session.create(req.body);
    
    // Populate user details in response
    const populatedSession = await Session.findById(session._id)
      .populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedSession
    });
  } catch (err) {
    console.error('Error creating session:', err); // Debug log
    res.status(400).json({ 
      error: err.message,
      details: err.errors || null
    });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    console.log('User ID from params:', req.params.userId); // Debug log
    
    const { userId } = req.params;
    
    // Validate user ID format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format' 
      });
    }

    const sessions = await Session.find({ user: userId })
      .populate('user', 'name email')
      .sort({ date: -1 }); // Sort by date descending (newest first)
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    console.error('Error fetching user sessions:', err); // Debug log
    res.status(500).json({ 
      error: err.message 
    });
  }
};

// Additional useful endpoints
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ 
        error: 'Invalid session ID format' 
      });
    }

    const session = await Session.findById(sessionId)
      .populate('user', 'name email');
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    console.error('Error fetching session:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('user', 'name email')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    console.error('Error fetching all sessions:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ 
        error: 'Invalid session ID format' 
      });
    }

    const session = await Session.findByIdAndUpdate(
      sessionId, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    console.error('Error updating session:', err);
    res.status(400).json({ 
      error: err.message 
    });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ 
        error: 'Invalid session ID format' 
      });
    }

    const session = await Session.findByIdAndDelete(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ 
      error: err.message 
    });
  }
};