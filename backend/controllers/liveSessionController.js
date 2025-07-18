import LiveSession from '../models/LiveSessions.js';

export const createLiveSession = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    // Validate required fields
    if (!req.body.roomId || !req.body.host) {
      return res.status(400).json({ 
        error: 'roomId and host are required fields' 
      });
    }

    const session = await LiveSession.create(req.body);
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (err) {
    console.error('Error creating live session:', err); // Debug log
    res.status(400).json({ 
      error: err.message,
      details: err.errors || null
    });
  }
};

export const getLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find()
      .populate('host', 'name mood')
      .populate('participants.userId', 'name mood');
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    console.error('Error fetching live sessions:', err); // Debug log
    res.status(500).json({ 
      error: err.message 
    });
  }
};