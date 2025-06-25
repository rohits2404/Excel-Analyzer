import express from 'express';
import { generateAISummary } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/ai/summary/:analysisId
router.post('/summary/:analysisId', protect, generateAISummary);

export default router;