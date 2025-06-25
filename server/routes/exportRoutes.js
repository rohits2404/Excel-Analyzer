// routes/exportRoutes.js
import express from 'express';
import { exportChartAsPDF, exportChartAsPNG } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pdf', protect, exportChartAsPDF);
router.post('/png', protect, exportChartAsPNG);

export default router;