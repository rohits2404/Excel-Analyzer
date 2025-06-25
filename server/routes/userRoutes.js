import express from 'express';
import { getUserHistory, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated user history
router.get('/history', protect, getUserHistory);

// Optional: Admin route to get all users
router.get('/admin/users', protect, getAllUsers);

export default router;