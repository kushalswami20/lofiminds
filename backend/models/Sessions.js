import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  type: { 
    type: String, 
    enum: ['Therapy', 'Meditation', 'Coaching'], 
    required: true 
  },
  duration: { 
    type: Number, 
    default: 45,
    min: 1,
    max: 300 // 5 hours max
  },
  therapist: {
    type: String,
    trim: true
  },
  goal: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
    default: 'scheduled'
  },
  sessionRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Add indexes for better performance
sessionSchema.index({ user: 1 });
sessionSchema.index({ date: -1 });
sessionSchema.index({ type: 1 });
sessionSchema.index({ status: 1 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export default Session;