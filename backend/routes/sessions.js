import express from 'express';
import { 
  createSession, 
  getUserSessions, 
  getSessionById,
  getAllSessions,
  updateSession,
  deleteSession 
} from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/user/:userId', getUserSessions);
router.get('/:sessionId', getSessionById);
router.put('/:sessionId', updateSession);
router.delete('/:sessionId', deleteSession);

export default router;