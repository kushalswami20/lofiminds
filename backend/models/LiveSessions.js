import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Make it optional if participants can join without user account
  },
  name: { 
    type: String, 
    required: true 
  },
  calmScore: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 0
  },
  expression: { 
    type: String, 
    enum: ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful'],
    default: 'neutral'
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'disconnected'],
    default: 'active'
  }
}, {
  timestamps: true
});

const liveSessionSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true,
    unique: true
  },
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  startTime: { 
    type: Date, 
    default: Date.now
  },
  endTime: Date,
  aiAnalysis: {
    faceExpression: String,
    emotionalState: String,
    posture: String,
    breathing: String,
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for better performance
liveSessionSchema.index({ roomId: 1 });
liveSessionSchema.index({ host: 1 });
liveSessionSchema.index({ status: 1 });

const LiveSession = mongoose.models.LiveSession || mongoose.model('LiveSession', liveSessionSchema);
export default LiveSession;