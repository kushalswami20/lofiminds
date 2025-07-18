

// Post Routes (postRoutes.js)
import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  toggleLike,
  toggleSupportive,
  getPostsByMood,
  getSupportivePosts
} from '../controllers/postController.js';

const router = express.Router();

// Basic CRUD routes
router.post('/', createPost);                    // Create post
router.get('/', getAllPosts);                   // Get all posts (with pagination & filters)
router.get('/:postId', getPostById);           // Get single post
router.put('/:postId', updatePost);            // Update post
router.delete('/:postId', deletePost);         // Delete post

// User-specific routes
router.get('/user/:userId', getUserPosts);     // Get posts by user

// Interaction routes
router.patch('/:postId/like', toggleLike);     // Like/Unlike post
router.patch('/:postId/supportive', toggleSupportive); // Toggle supportive

// Filter routes
router.get('/mood/:mood', getPostsByMood);     // Get posts by mood
router.get('/filter/supportive', getSupportivePosts); // Get supportive posts

export default router;