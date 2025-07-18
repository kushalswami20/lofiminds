import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  mood: String,
  moodHistory: [
    {
      mood: String,
      timestamp: Date
    }
  ],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
