import express from 'express';
import { handleExcelUpload, upload } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route with middleware
router.post('/', protect, upload, handleExcelUpload);

export default router;