import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import sessionRoutes from './routes/sessions.js';
import liveSessionRoutes from './routes/liveSession.js';
import cors from 'cors';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/livesessions', liveSessionRoutes);

export default app;
