import express from 'express';
import { createLiveSession, getLiveSessions } from '../controllers/liveSessionController.js';

const router = express.Router();

router.post('/', createLiveSession);
router.get('/', getLiveSessions);

export default router;
