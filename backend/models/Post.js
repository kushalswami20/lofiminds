import mongoose from 'mongoose';
import User from './User.js'; // Ensure User model is registered

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    supportive: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
